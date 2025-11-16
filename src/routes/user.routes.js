const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

module.exports = (app) => {
  // Ví dụ route: Lấy tất cả người dùng (chỉ admin)
  app.get('/api/users', verifyToken, userController.getAllUsers);

  // Thêm các route khác cho người dùng tại đây
  // app.get('/api/users/:id', verifyToken, userController.getUserById);
  // app.put('/api/users/:id', verifyToken, userController.updateUser);
  // app.delete('/api/users/:id', verifyToken, userController.deleteUser);
};
