const db = require("../models");
const Size = db.sizes;

// 1. Tạo size mới (yêu cầu quyền Admin)
exports.create = async (req, res) => {
  try {
    const { ten } = req.body;
    if (!ten) {
      return res.status(400).send({ message: "Tên size là bắt buộc." });
    }
    const newSize = await Size.create({ ten });
    res.status(201).send(newSize);
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};

// 2. Lấy tất cả size
exports.findAll = async (req, res) => {
  try {
    const sizes = await Size.findAll();
    res.status(200).send(sizes);
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};

// 3. Cập nhật size (yêu cầu quyền Admin)
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await Size.update(req.body, { where: { id: id } });
    if (updated) {
      const updatedSize = await Size.findByPk(id);
      res.status(200).send(updatedSize);
    } else {
      res.status(404).send({ message: "Không tìm thấy size để cập nhật." });
    }
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};

// 4. Xóa size (yêu cầu quyền Admin)
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Size.destroy({ where: { id: id } });
    if (deleted) {
      res.status(200).send({ message: "Size đã được xóa thành công." });
    } else {
      res.status(404).send({ message: "Không tìm thấy size để xóa." });
    }
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};