const db = require("../models");
const Category = db.categories;
const Product = db.products;
const Op = db.Sequelize.Op;

// 1. Lấy tất cả danh mục
exports.findAll = async (req, res) => {
  try {
    const { ten_dm } = req.query;
    const condition = {};

    // Nếu có tham số tìm kiếm theo tên danh mục, thêm vào điều kiện
    if (ten_dm) {
      condition.ten_dm = { [Op.like]: `%${ten_dm}%` };
    }

    const categories = await Category.findAll({
      where: condition,
      include: [{
        model: Product,
        as: 'products',
        attributes: ['id', 'ten_sp'] // Chỉ lấy một vài trường của sản phẩm cho gọn
      }]
    });
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};

// 2. Tạo danh mục mới (yêu cầu quyền Admin)
exports.create = async (req, res) => {
  try {
    const { ten_dm, slug, mo_ta } = req.body;
    if (!ten_dm) {
      return res.status(400).send({ message: "Tên danh mục là bắt buộc." });
    }
    const newCategory = await Category.create({ ten_dm, slug, mo_ta });
    res.status(201).send(newCategory);
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};

// 3. Cập nhật danh mục (yêu cầu quyền Admin)
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await Category.update(req.body, {
      where: { id: id }
    });

    if (updated) {
      const updatedCategory = await Category.findByPk(id);
      res.status(200).send(updatedCategory);
    } else {
      res.status(404).send({ message: "Không tìm thấy danh mục để cập nhật." });
    }
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};

// 4. Xóa danh mục (yêu cầu quyền Admin)
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Category.destroy({
      where: { id: id }
    });

    if (deleted) {
      res.status(200).send({ message: "Danh mục đã được xóa thành công." });
    } else {
      res.status(404).send({ message: "Không tìm thấy danh mục để xóa." });
    }
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};