// /models/product.model.js
module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("Product", { // Tên model nên viết hoa
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_dm: {
      type: Sequelize.INTEGER,
    },
    ten_sp: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING
    },
    mo_ta_ct: {
      type: Sequelize.TEXT,
    },
    mo_ta_ngan: {
      type: Sequelize.TEXT,
    },
    an_hien: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  }, {
    // Tắt tính năng tự động thêm các trường timestamps (createdAt, updatedAt)
    timestamps: false
  });
  // Gán tên bảng một cách tường minh
  Product.tableName = "san_pham";
  
  return Product;
};