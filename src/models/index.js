// /models/index.js
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

// 1. Khởi tạo kết nối Sequelize
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
);

// 2. Tạo đối tượng 'db' để quản lý
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 3. Nạp (import) các model
// Chúng ta nạp model User dựa trên ERD của bạn
db.users = require("./user.model.js")(sequelize, Sequelize);
// Nạp model Product
db.products = require("./product.model.js")(sequelize, Sequelize);
// Nạp model Category
db.categories = require("./category.model.js")(sequelize, Sequelize);
// Nạp model Size và Color
db.sizes = require("./size.model.js")(sequelize, Sequelize);
db.colors = require("./color.model.js")(sequelize, Sequelize);
// Nạp model ProductVariant (đã đổi tên thành bien_the)
db.productVariants = require("./productVariant.model.js")(sequelize, Sequelize);

// 4. Thiết lập các mối quan hệ (Associations)
// Một Danh mục (Category) có nhiều Sản phẩm (Product)
db.categories.hasMany(db.products, { foreignKey: 'id_dm', as: 'products' });
// Một Sản phẩm (Product) thuộc về một Danh mục (Category)
db.products.belongsTo(db.categories, { foreignKey: 'id_dm', as: 'category' });

// Một sản phẩm (Product) có nhiều biến thể (ProductVariant)
db.products.hasMany(db.productVariants, { foreignKey: "id_sp", as: "variants" });
db.productVariants.belongsTo(db.products, { foreignKey: "id_sp", as: "product" });

// Một Size có nhiều biến thể
db.sizes.hasMany(db.productVariants, { foreignKey: "id_size" });
db.productVariants.belongsTo(db.sizes, { foreignKey: "id_size", as: "size" });

// Một Color có nhiều biến thể
db.colors.hasMany(db.productVariants, { foreignKey: "id_mau" });
db.productVariants.belongsTo(db.colors, { foreignKey: "id_mau", as: "color" });

// 5. Xuất 'db' ra để server.js có thể dùng
module.exports = db;