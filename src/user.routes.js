const controller = require("../controllers/user.controller.js");
const { verifyToken, isAdmin } = require("../models/auth.middleware.js");

module.exports = function(app) {
 app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  // API để lấy danh sách tất cả người dùng
  // Chỉ Admin mới có quyền truy cập
  app.get("/api/users", [verifyToken, isAdmin], controller.getAllUsers);
 
  // API để cấp quyền Admin cho một người dùng theo ID
  // Chỉ Admin mới có quyền truy cập
  app.put("/api/users/:id/make-admin", [verifyToken, isAdmin], controller.grantAdminRole);
};