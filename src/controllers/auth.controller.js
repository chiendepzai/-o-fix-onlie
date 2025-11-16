const db = require("../models");
const User = db.users; // Lấy model User
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // Module có sẵn của Node.js
const { sendVerificationEmail } = require("./email.service");

// Đọc JWT_SECRET từ file .env (file .env phải ở thư mục gốc duan2/)

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Chức năng 1: Đăng ký (Register)
 * Sửa đổi: Gửi link xác thực thay vì tạo user ngay lập tức.
 */
exports.register = async (req, res) => {
  // Bắt đầu một giao tác (transaction)
  const t = await db.sequelize.transaction();

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      // Không cần await t.rollback() ở đây vì chưa có thao tác DB nào
      return res.status(400).send({ message: "Tên, Email và Mật khẩu là bắt buộc!" });
    }

    // Thực hiện tất cả các truy vấn trong transaction
    let user = await User.findOne({ where: { email: email }, transaction: t });

    // Nếu user tồn tại và đã được xác thực, báo lỗi
    if (user && user.isVerified) {
      await t.rollback(); // Hủy bỏ giao tác
      return res.status(400).send({ message: "Email đã được sử dụng." });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    if (user && !user.isVerified) {
      // Nếu user tồn tại nhưng chưa xác thực, cập nhật lại thông tin và OTP
      await user.update({
        name,
        password: hashedPassword,
      }, { transaction: t });
    } else {
      // Nếu user chưa tồn tại, tạo mới với trạng thái chưa xác thực
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        isVerified: false
      }, { transaction: t });
    }

    // Tạo token xác thực email (có thời hạn 15 phút)
    const verificationToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15m' });

    // Gửi email chứa link xác thực
    await sendVerificationEmail(email, verificationToken);

    // Nếu mọi thứ thành công (bao gồm cả gửi email), commit giao tác
    await t.commit();

    res.status(200).send({
      message: "Một link xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư để kích hoạt tài khoản.",
    });
  } catch (error) {
    // Nếu có bất kỳ lỗi nào xảy ra, rollback tất cả các thay đổi trong DB
    await t.rollback();
    // Ghi log lỗi chi tiết ra console của server
    console.error("❌ LỖI TRONG QUÁ TRÌNH ĐĂNG KÝ:", error);
    // Gửi về một thông báo lỗi rõ ràng hơn cho client
    res.status(500).send({ message: "Đã xảy ra lỗi trong quá trình đăng ký. Chi tiết: " + error.message });
  }
};

/**
 * Chức năng mới: Xác thực tài khoản bằng link
 */
exports.verifyAccount = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send({ message: "Token xác thực không được cung cấp." });
    }

    // Giải mã token
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).send({ message: "Người dùng không tồn tại." });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).send({ message: "Xác thực tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ." });
  } catch (error) {
    console.log("!!! LỖI BÊN TRONG CATCH:", error);
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};

/**
 * Chức năng 2: Đăng nhập (Login)
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: "Email và mật khẩu là bắt buộc!" });
    }

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(401).send({ message: "Email hoặc mật khẩu không đúng!" });
    }

    // Kiểm tra xem tài khoản đã được xác thực chưa
    if (!user.isVerified) {
      return res.status(403).send({ message: "Tài khoản chưa được xác thực. Vui lòng kiểm tra email của bạn." });
    }

    // So sánh mật khẩu
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Email hoặc mật khẩu không đúng!" });
    }

    // Tạo JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).send({
      message: "Đăng nhập thành công!",
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};

/**
 * Chức năng mới: Gửi lại link xác thực
 */
exports.resendVerificationLink = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Email là bắt buộc." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || user.isVerified) {
      return res.status(400).send({ message: "Email không hợp lệ hoặc đã được xác thực." });
    }

    // Tạo token xác thực email mới (có thời hạn 15 phút)
    const verificationToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15m' });

    // Gửi lại email
    await sendVerificationEmail(email, verificationToken);

    res.status(200).send({ message: "Một link xác thực mới đã được gửi đến email của bạn." });
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};
/**
 * Chức năng 3: Xử lý sau khi đăng nhập Google thành công
 */
exports.googleCallback = async (req, res) => {
  try {
    // Thông tin user được passport trả về trong req.user
    const user = req.user;

    // Tạo JWT Token giống như khi đăng nhập thường
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Bạn có thể chuyển hướng người dùng về trang frontend
    // kèm theo token để họ lưu lại
    // Ví dụ: res.redirect(`http://localhost:3000/login-success?token=${token}`);

    res.status(200).send({
      message: "Đăng nhập bằng Google thành công!",
      accessToken: token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};