const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require("../models");
const User = db.users;
const jwt = require("jsonwebtoken");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Tìm user trong DB bằng googleId hoặc email
      let user = await User.findOne({ where: { email: profile.emails[0].value } });

      if (user) {
        // Nếu user đã tồn tại, chỉ cần cập nhật googleId nếu chưa có
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
      } else {
        // Nếu user chưa tồn tại, tạo user mới
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          // Mật khẩu có thể để null hoặc một giá trị ngẫu nhiên vì không dùng đến
          password: null, 
          role: 'user' // Gán vai trò mặc định
        });
      }

      // Trả về thông tin user để passport xử lý tiếp
      return done(null, user);

    } catch (error) {
      return done(error, null);
    }
  }
));

// Hai hàm này cần thiết cho express-session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findByPk(id).then(user => done(null, user));
});