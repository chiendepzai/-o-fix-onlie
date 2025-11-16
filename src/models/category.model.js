// /models/category.model.js
module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define("Category", { // Tên model nên viết hoa
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ten_dm: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      unique: true,
    },
  });
  // Gán tên bảng một cách tường minh
  Category.tableName = "danh_muc";
  
  return Category;
};