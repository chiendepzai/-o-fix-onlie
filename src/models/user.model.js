// /models/user.model.js
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true, // BẮT BUỘC: Cho phép null cho đăng nhập social
    },
    googleId: {
      type: Sequelize.STRING,
      field: "google_id",
    },
    role: {
      type: Sequelize.STRING,
      defaultValue: "user",
    },
    // --- CÁC TRƯỜNG MỚI CHO VIỆC XÁC THỰC EMAIL ---
    isVerified: {
      type: Sequelize.BOOLEAN,
      field: "is_verified", // Thêm dòng này
      defaultValue: false,
    },
    // ---------------------------------------------
  });

  return User;
};