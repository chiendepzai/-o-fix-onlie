const controller = require("../controllers/size.controller");
const { verifyToken, isAdmin } = require("../models/auth.middleware.js");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/sizes", controller.findAll);
  app.post("/api/sizes", [verifyToken, isAdmin], controller.create);
  app.put("/api/sizes/:id", [verifyToken, isAdmin], controller.update);
  app.delete("/api/sizes/:id", [verifyToken, isAdmin], controller.delete);
};