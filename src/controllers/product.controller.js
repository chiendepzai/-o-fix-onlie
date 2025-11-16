const db = require("../models");
const Product = db.products;
const Category = db.categories;
const ProductVariant = db.productVariants;
const Size = db.sizes;
const Color = db.colors;
const Op = db.Sequelize.Op;

// 1. Tạo sản phẩm mới
exports.create = async (req, res) => {
  try {
    // Dữ liệu sản phẩm cơ bản theo model mới
    const productData = {
      id_dm: req.body.id_dm,
      ten_sp: req.body.ten_sp,
      slug: req.body.slug,
      mo_ta_ct: req.body.mo_ta_ct,
      mo_ta_ngan: req.body.mo_ta_ngan
    };

    const product = await Product.create(productData);
    res.status(201).send(product);
  } catch (error) {
    console.error("❌ Lỗi khi tạo sản phẩm:", error); // In lỗi chi tiết ra console server
    res.status(500).send({ message: "Lỗi server: " + error.message }); // Gửi thông báo lỗi chung về client
  }
};

// 2. Lấy danh sách tất cả sản phẩm
exports.findAll = async (req, res) => {
  try {
    const { ten_sp, id_dm, page, size, sortBy, order } = req.query;

    const limit = size ? +size : 10; // Mặc định 10 sản phẩm mỗi trang
    const offset = page ? (page - 1) * limit : 0;

    const condition = {};

    // Nếu có tham số tìm kiếm theo tên, thêm vào điều kiện
    if (ten_sp) {
      condition.ten_sp = { [Op.like]: `%${ten_sp}%` };
    }

    // Nếu có tham số tìm kiếm theo danh mục, thêm vào điều kiện
    // Kiểm tra chính xác hơn: chỉ thêm điều kiện khi id_dm được cung cấp và không phải là chuỗi rỗng.
    if (id_dm) {
      // Chuyển đổi id_dm thành một mảng các số
      // Ví dụ: "1,2,3" -> [1, 2, 3]
      const categoryIds = id_dm.split(',')
                               .map(id => Number(id.trim()))
                               .filter(id => !isNaN(id)); // Lọc ra các giá trị không phải là số (NaN)

      if (categoryIds.length > 0) {
        condition.id_dm = { [Op.in]: categoryIds };
      }
    }

    const sortOrder = (sortBy && order) ? [[sortBy, order.toUpperCase()]] : [['id', 'DESC']]; // Mặc định sắp xếp theo ID giảm dần

    const data = await Product.findAndCountAll({ 
      where: condition,
      limit,
      offset,      
      order: sortOrder,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'ten_dm']
        }
      ],
      distinct: true, // Cần thiết khi dùng include với limit/offset
    });

    const response = { totalItems: data.count, products: data.rows, totalPages: Math.ceil(data.count / limit), currentPage: page ? +page : 1 };
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};

// 3. Lấy thông tin chi tiết một sản phẩm theo ID
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'ten_dm']
        },
        {
          model: ProductVariant,
          as: 'variants',
          include: [
            { model: Size, as: 'size', attributes: ['id', 'ten'] },
            { model: Color, as: 'color', attributes: ['id', 'ten', 'ma_mau'] }
          ]
        }
      ]
    });

    if (!product) {
      return res.status(404).send({ message: "Không tìm thấy sản phẩm." });
    }

    res.status(200).send(product);
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};

// 4. Cập nhật sản phẩm
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    // Dữ liệu sản phẩm cơ bản có thể cập nhật
    const productData = {
      id_dm: req.body.id_dm,
      ten_sp: req.body.ten_sp,
      slug: req.body.slug,
      mo_ta_ct: req.body.mo_ta_ct,
      mo_ta_ngan: req.body.mo_ta_ngan
    };
    const [updated] = await Product.update(productData, {
      where: { id: id }
    });

    if (updated) {
      const updatedProduct = await Product.findByPk(id);
      res.status(200).send(updatedProduct);
    } else {
      res.status(404).send({ message: "Không tìm thấy sản phẩm để cập nhật." });
    }
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};

// 5. Xóa sản phẩm
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Product.destroy({
      where: { id: id }
    });

    if (deleted) {
      res.status(200).send({ message: "Sản phẩm đã được xóa thành công." });
    } else {
      res.status(404).send({ message: "Không tìm thấy sản phẩm để xóa." });
    }
  } catch (error) {
    res.status(500).send({ message: "Lỗi server: " + error.message });
  }
};