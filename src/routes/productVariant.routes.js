const controller = require("../controllers/productVariant.controller");
const { verifyToken, isAdmin } = require("../models/auth.middleware.js");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });
  
  // API để thêm biến thể mới vào một sản phẩm đã có
  app.post("/api/products/:productId/variants", [verifyToken, isAdmin], controller.create);

  // API để cập nhật một biến thể cụ thể
  app.put("/api/variants/:id", [verifyToken, isAdmin], controller.update);

  // API để xóa một biến thể cụ thể
  app.delete("/api/variants/:id", [verifyToken, isAdmin], controller.delete);
};