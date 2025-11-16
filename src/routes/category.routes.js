const controller = require("../controllers/category.controller");
const { verifyToken, isAdmin } = require("../models/auth.middleware.js");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  // API để lấy tất cả danh mục (công khai)
  app.get("/api/categories", controller.findAll);

  // API để tạo danh mục mới (chỉ Admin)
  app.post("/api/categories", [verifyToken, isAdmin], controller.create);

  // API để cập nhật danh mục (chỉ Admin)
  app.put("/api/categories/:id", [verifyToken, isAdmin], controller.update);

  // API để xóa danh mục (chỉ Admin)
  app.delete("/api/categories/:id", [verifyToken, isAdmin], controller.delete);
};