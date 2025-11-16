const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.users;

const verifyToken = async (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ message: 'Không có token được cung cấp!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Gán userId vào request để sử dụng ở các middleware hoặc controller tiếp theo
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).send({ message: 'Người dùng không tồn tại.' });
    }
    req.user = user; // Gán toàn bộ đối tượng user vào request
    next();
  } catch (error) {
    return res.status(401).send({ message: 'Không được ủy quyền!' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).send({ message: 'Yêu cầu quyền Admin!' });
  }
};

module.exports = {
  verifyToken,
  isAdmin
};
