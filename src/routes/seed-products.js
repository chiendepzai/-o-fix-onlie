// src/seeders/seed-products.js
const db = require('../models');
const Product = db.products;

const sampleProducts = [
  {
    id_dm: 1,
    ten_sp: "Áo Thun Cotton Basic",
    slug: "ao-thun-cotton-basic",
    mo_ta_ngan: "Áo thun 100% cotton, thoáng mát.",
    mo_ta_ct: "Chi tiết áo thun 100% cotton, thấm hút mồ hôi tốt, phù hợp cho mọi hoạt động hàng ngày."
  },
  {
    id_dm: 1,
    ten_sp: "Áo Polo Pique",
    slug: "ao-polo-pique",
    mo_ta_ngan: "Áo polo vải cá sấu, lịch lãm.",
    mo_ta_ct: "Áo polo nam với chất liệu vải Pique (cá sấu) cao cấp, co giãn 4 chiều, mang lại vẻ ngoài lịch sự và năng động."
  },
  {
    id_dm: 2,
    ten_sp: "Quần Jeans Slim-fit",
    slug: "quan-jeans-slim-fit",
    mo_ta_ngan: "Quần jeans nam ống côn, tôn dáng.",
    mo_ta_ct: "Quần jeans nam phom dáng slim-fit, chất liệu denim co giãn nhẹ, mang lại sự thoải mái khi di chuyển."
  },
  {
    id_dm: 2,
    ten_sp: "Quần Kaki Chinos",
    slug: "quan-kaki-chinos",
    mo_ta_ngan: "Quần kaki nam công sở.",
    mo_ta_ct: "Quần kaki với phom dáng Chinos hiện đại, chất vải mềm mịn, không nhăn, phù hợp cho môi trường công sở."
  },
  {
    id_dm: 3,
    ten_sp: "Váy Đầm Suông In Hoa",
    slug: "vay-dam-suong-in-hoa",
    mo_ta_ngan: "Váy đầm suông, họa tiết hoa nhí.",
    mo_ta_ct: "Váy đầm dáng suông, chất liệu voan lụa mềm mại, họa tiết hoa nhí nữ tính, thích hợp đi dạo phố hoặc dự tiệc nhẹ."
  },
  {
    id_dm: 1,
    ten_sp: "Áo Sơ Mi Dài Tay",
    slug: "ao-so-mi-dai-tay",
    mo_ta_ngan: "Áo sơ mi nam phom regular.",
    mo_ta_ct: "Áo sơ mi nam dài tay, chất liệu kate Mỹ cao cấp, ít nhăn, phom dáng regular fit thoải mái."
  },
  {
    id_dm: 2,
    ten_sp: "Quần Short Thể Thao",
    slug: "quan-short-the-thao",
    mo_ta_ngan: "Quần short vải dù, nhanh khô.",
    mo_ta_ct: "Quần short thể thao nam, chất liệu vải dù siêu nhẹ, nhanh khô, có túi khóa kéo tiện lợi, phù hợp cho các hoạt động thể thao."
  },
  {
    id_dm: 3,
    ten_sp: "Chân Váy Chữ A",
    slug: "chan-vay-chu-a",
    mo_ta_ngan: "Chân váy chữ A công sở.",
    mo_ta_ct: "Chân váy chữ A dài qua gối, chất liệu tuyết mưa dày dặn, đứng phom, là lựa chọn hoàn hảo cho các quý cô công sở."
  },
  {
    id_dm: 1,
    ten_sp: "Áo Khoác Hoodie Nỉ",
    slug: "ao-khoac-hoodie-ni",
    mo_ta_ngan: "Áo hoodie nỉ bông ấm áp.",
    mo_ta_ct: "Áo khoác hoodie unisex, chất liệu nỉ bông dày dặn, giữ ấm tốt, thiết kế trẻ trung, năng động."
  },
  {
    id_dm: 2,
    ten_sp: "Quần Âu Nam Lịch Lãm",
    slug: "quan-au-nam-lich-lam",
    mo_ta_ngan: "Quần âu nam ống đứng.",
    mo_ta_ct: "Quần âu nam cao cấp, chất vải co giãn nhẹ, không bai xù, phom dáng ống đứng sang trọng, phù hợp cho các sự kiện quan trọng."
  }
];

const seedProducts = async () => {
    try {
        console.log("Bắt đầu thêm 10 sản phẩm mẫu...");
        await Product.bulkCreate(sampleProducts);
        console.log("✅ Thêm 10 sản phẩm mẫu thành công!");
    } catch (error) {
        console.error("❌ Lỗi khi thêm dữ liệu mẫu:", error);
    } finally {
        await db.sequelize.close();
    }
};

seedProducts();