const db = require("../models");
const Product = db.products;
const ProductVariant = db.productVariants; // Model này trỏ đến bảng 'bien_the'

// 1. Thêm một hoặc nhiều biến thể mới cho một sản phẩm đã có
exports.create = async (req, res) => {
  try {
    const productId = req.params.productId;
    const variants = req.body.variants; // Dữ liệu gửi lên là một mảng các biến thể

    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).send({ message: "Không tìm thấy sản phẩm." });
    }

    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return res.status(400).send({ message: "Dữ liệu biến thể không hợp lệ." });
    }

    // Gắn id_sp (productId) vào mỗi biến thể và ánh xạ các trường cho đúng với model
    const variantData = variants.map(variant => ({
      id_sp: productId,
      id_size: variant.id_size,
      id_mau: variant.id_mau,
      gia: variant.gia,
      so_luong: variant.so_luong,
    }));

    const newVariants = await ProductVariant.bulkCreate(variantData);

    res.status(201).send(newVariants);
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};

// 2. Cập nhật thông tin một biến thể (theo ID của biến thể)
exports.update = async (req, res) => {
  try {
    const id = req.params.id;    
    // Chỉ cho phép cập nhật các trường cụ thể để bảo mật
    const updateData = {
      gia: req.body.gia,
      so_luong: req.body.so_luong
    };

    // Xóa các trường undefined để không ghi đè giá trị null vào DB
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const [updated] = await ProductVariant.update(updateData, {
      where: { id: id }
    });

    if (updated) {
      const updatedVariant = await ProductVariant.findByPk(id);
      res.status(200).send(updatedVariant);
    } else {
      res.status(404).send({ message: "Không tìm thấy biến thể để cập nhật." });
    }
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};

// 3. Xóa một biến thể (theo ID của biến thể)
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await ProductVariant.destroy({
      where: { id: id }
    });

    if (deleted) {
      res.status(200).send({ message: "Biến thể đã được xóa thành công." });
    } else {
      res.status(404).send({ message: "Không tìm thấy biến thể để xóa." });
    }
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};