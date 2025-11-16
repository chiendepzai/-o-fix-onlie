const db = require("../models");
const Color = db.colors;

// 1. Tạo màu mới (yêu cầu quyền Admin)
exports.create = async (req, res) => {
  try {
    const { ten, ma_mau } = req.body;
    if (!ten || !ma_mau) {
      return res.status(400).send({ message: "Tên màu và mã màu là bắt buộc." });
    }
    const newColor = await Color.create({ ten, ma_mau });
    res.status(201).send(newColor);
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};

// 2. Lấy tất cả màu
exports.findAll = async (req, res) => {
  try {
    const colors = await Color.findAll();
    res.status(200).send(colors);
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};

// 3. Cập nhật màu (yêu cầu quyền Admin)
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await Color.update(req.body, { where: { id: id } });
    if (updated) {
      const updatedColor = await Color.findByPk(id);
      res.status(200).send(updatedColor);
    } else {
      res.status(404).send({ message: "Không tìm thấy màu để cập nhật." });
    }
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};

// 4. Xóa màu (yêu cầu quyền Admin)
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Color.destroy({ where: { id: id } });
    if (deleted) {
      res.status(200).send({ message: "Màu đã được xóa thành công." });
    } else {
      res.status(404).send({ message: "Không tìm thấy màu để xóa." });
    }
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};