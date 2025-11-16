const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.users;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware để xác thực token
const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  // Hỗ trợ thêm chuẩn "Bearer Token"
  const authHeader = req.headers["authorization"];
  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7, authHeader.length);
  }

  if (!token) {
    return res.status(403).send({ message: "Yêu cầu cần có token để xác thực!" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
    // Lưu thông tin user đã giải mã vào request để các hàm sau có thể sử dụng
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// Middleware để kiểm tra vai trò admin
const isAdmin = async (req, res, next) => {
  if (req.userRole === 'admin') {
    return next();
  }

  // Nếu không phải admin, có thể kiểm tra trong DB để chắc chắn
  const user = await User.findByPk(req.userId);
  if (user && user.role === 'admin') {
    return next();
  }

  return res.status(403).send({ message: "Yêu cầu quyền Admin!" });
};

const authMiddleware = { verifyToken, isAdmin };

module.exports = authMiddleware;