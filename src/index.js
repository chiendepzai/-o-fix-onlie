// src/index.js

const express = require("express");
const cors = require("cors");
require('dotenv').config();// Đọc file .env (file .env vẫn ở thư mục gốc)
const passport = require('passport');
const session = require('express-session');

// Nạp cấu hình passport
require('./config/passport.config');

console.log("==> GIÁ TRỊ JWT_SECRET ĐỌC ĐƯỢC:", process.env.JWT_SECRET);
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Kết nối Database
// Vì index.js CÙNG CẤP với 'models', đường dẫn chỉ là './models'
const db = require("./models"); 

// Sử dụng { alter: true } để tự động cập nhật schema của DB mà không làm mất dữ liệu.
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Đã kiểm tra và đồng bộ database.");
  })
  .catch((err) => {
    console.error("❌ Lỗi đồng bộ database: ", err.message);
  });

// Route cơ bản
app.get("/", (req, res) => {
  res.json({ message: "Chào mừng đến với API E-commerce." });
});

// Load các routes
// Vì index.js CÙNG CẤP với 'routes', đường dẫn chỉ là './routes/...'
require('./routes/auth.routes')(app); 
require('./routes/product.routes')(app);
require('./routes/category.routes')(app);
require('./routes/size.routes')(app);
require('./routes/color.routes')(app);
require('./routes/productVariant.routes')(app);
require('./routes/user.routes')(app); // Bổ sung API cho user
// Khởi chạy Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
 console.log(`--- PHIÊN BẢN SERVER MỚI NHẤT ĐANG CHẠY TRÊN CỔNG ${PORT} ---`);
});