const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helper/create-tree.js");

const index = async (req, res) => {
  let find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }
  const countProducts = await ProductCategory.countDocuments(find);

  let sort = {};
  if (req.query.sortKey) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }

  const records = await ProductCategory.find(find).sort(sort);

  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: records,
    keyword: req.query.keyword,
  });
};
const create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);
  const newRecords = createTreeHelper(records);
  // console.log(newRecords);
  res.render("admin/pages/products-category/create", {
    pageTitle: "Tạo mới sản phẩm",
    records: newRecords,
  });
};
const createPost = async (req, res) => {
  if (req.body.position == "") {
    const countProducts = await ProductCategory.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const record = new ProductCategory(req.body);
  await record.save();
  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};
const edit = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false,
    });
    const records = await ProductCategory.find({ deleted: false });
    const newRecords = createTreeHelper(records);
    res.render("admin/pages/products-category/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      data: data,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};
const editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.position = parseInt(req.body.position);

  await ProductCategory.updateOne({ _id: id }, req.body);
  req.flash("success", "Edit product successfully!");
  res.redirect(`back`);
};
module.exports = { index, create, createPost, create, edit, editPatch };
