// /models/productVariant.model.js
module.exports = (sequelize, Sequelize) => {
  // Đổi tên bảng cho khớp với ERD
  const ProductVariant = sequelize.define("ProductVariant", { // Tên model nên viết hoa
    // id_sp, id_size, id_mau sẽ được Sequelize tự động thêm vào khi thiết lập quan hệ
    gia: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    so_luong: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    luot_ban: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  });
  // Gán tên bảng một cách tường minh
  ProductVariant.tableName = "bien_the";
  
  return ProductVariant;
};