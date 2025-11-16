// /models/size.model.js
module.exports = (sequelize, Sequelize) => {
  const Size = sequelize.define("Size", { // Tên model nên viết hoa
    ten: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  });
  // Gán tên bảng một cách tường minh
  Size.tableName = "sizes";

  return Size;
};