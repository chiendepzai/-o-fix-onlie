const db = require("../models");
const User = db.users; // Lấy model User

// Hàm này sẽ lấy thông tin của user dựa trên token
exports.getMe = async (req, res) => {
  try {
    // req.userId được gán từ middleware (auth.middleware.js)
    // sau khi nó giải mã token
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'email', 'role'] // Chỉ lấy các trường an toàn
    });

    if (!user) {
      return res.status(404).send({ message: "Không tìm thấy người dùng." });
    }

    res.status(200).send(user); // Gửi về thông tin user

  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};

// Hàm này sẽ lấy tất cả người dùng (chỉ admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role']
    });
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};
