// /models/color.model.js
module.exports = (sequelize, Sequelize) => {
  const Color = sequelize.define("Color", { // Tên model nên viết hoa
    ten: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    ma_mau: {
      type: Sequelize.STRING, // Ví dụ: '#FFFFFF'
      allowNull: false,
      unique: true,
    },
  });
  // Gán tên bảng một cách tường minh
  Color.tableName = "mau";

  return Color;
};