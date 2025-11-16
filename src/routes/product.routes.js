const controller = require("../controllers/product.controller");
const { verifyToken, isAdmin } = require("../models/auth.middleware.js");

module.exports = function(app) {
  // Middleware để thêm header cho phép CORS, có thể không cần nếu đã cấu hình ở index.js
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  // API để tạo sản phẩm mới
  app.post("/api/products", [verifyToken, isAdmin], controller.create);

  // API để lấy tất cả sản phẩm
  app.get("/api/products", controller.findAll);

  // API để lấy chi tiết một sản phẩm
  app.get("/api/products/:id", controller.findOne);

  // API để cập nhật sản phẩm
  app.put("/api/products/:id", [verifyToken, isAdmin], controller.update);

  // API để xóa sản phẩm
  app.delete("/api/products/:id", [verifyToken, isAdmin], controller.delete);
};