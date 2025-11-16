// src/routes/seed-categories.js
const db = require('./src/models');
const Category = db.categories;

const sampleCategories = [
  {
    id: 1, // Gán ID tường minh để khớp với dữ liệu sản phẩm
    ten_dm: "Áo",
    slug: "ao",
  },
  {
    id: 2, // Gán ID tường minh
    ten_dm: "Quần",
    slug: "quan",
  },
  {
    id: 3, // Gán ID tường minh
    ten_dm: "Váy Đầm",
    slug: "vay-dam",
  }
];

const seedCategories = async () => {
    try {
        console.log("Bắt đầu thêm danh mục mẫu...");
        await Category.bulkCreate(sampleCategories);
        console.log("✅ Thêm danh mục mẫu thành công!");
    } catch (error) {
        console.error("❌ Lỗi khi thêm dữ liệu danh mục:", error);
    } finally {
        await db.sequelize.close();
    }
};

seedCategories();