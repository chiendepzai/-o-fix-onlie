const controller = require("../controllers/auth.controller"); // Nạp controller
const passport = require('passport');

module.exports = function(app) {
  // Khi có request POST tới /api/auth/register
  // nó sẽ gọi hàm controller.register để xử lý
  app.post("/api/auth/register", controller.register);
  
  // Route mới để xác thực tài khoản bằng link (phía frontend sẽ gọi API này)
  app.get("/api/auth/verify-account", controller.verifyAccount);
  
  // Route mới để gửi lại link xác thực
  app.post("/api/auth/resend-verification", controller.resendVerificationLink);
  
  // Khi có request POST tới /api/auth/login
  // nó sẽ gọi hàm controller.login để xử lý
  app.post("/api/auth/login", controller.login);

  // Route để bắt đầu quá trình đăng nhập bằng Google
  app.get(
    "/api/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  // Route callback mà Google sẽ gọi lại
  // Sau khi xác thực thành công, nó sẽ gọi hàm googleCallback trong controller
  app.get("/api/auth/callback/google", passport.authenticate("google", { session: false }), controller.googleCallback);
};
