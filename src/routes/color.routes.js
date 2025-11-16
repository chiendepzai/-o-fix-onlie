const controller = require("../controllers/color.controller");
const { verifyToken, isAdmin } = require("../models/auth.middleware.js");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/colors", controller.findAll);
  app.post("/api/colors", [verifyToken, isAdmin], controller.create);
  app.put("/api/colors/:id", [verifyToken, isAdmin], controller.update);
  app.delete("/api/colors/:id", [verifyToken, isAdmin], controller.delete);
};