const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const ProductCategory = require("../../models/product-category.model");
const filterStatusHelper = require("../../helper/filterStatus.js");
const searchHelper = require("../../helper/search.js");
const paginationHelper = require("../../helper/pagination.js");
const { request } = require("express");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helper/create-tree.js");

// [GET] /admin/products
const product = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);
  let find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }
  searchHelper(find, req.query);
  const countProducts = await Product.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts
  );
  // console.log(objectPagination);
  let sort = {};
  if (req.query.sortKey) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
  for (const item of products) {
    const account = await Account.findOne({ _id: item.createdBy.account_id });
    if (account) {
      item.createdBy.fullName = account.fullName;
    }
    const updatedBy = item.updatedBy.slice(-1)[0];
    if (updatedBy) {
      const user = await Account.findOne({ _id: updatedBy.account_id });
      if (user) {
        updatedBy.fullName = user.fullName;
      }
    }
  }

  res.render("admin/pages/products/index", {
    pageTitle: "Trang sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: req.query.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/products/change-status/:status/:id
const changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  await Product.updateOne({ _id: id }, { status: status });
  res.flash("success", "Change status successfully!");
  res.redirect("back");
};

// [PATCH] /admin/products/change-multi
const changeMulti = async (req, res) => {
  const ids = req.body.ids.split(",");
  const type = req.body.type;
  // console.log(ids);
  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      break;
    case "delete-all":
      await Product.updateMany(
        {
          _id: { $in: ids },
        },
        {
          deleted: true,
          deletedAt: Date.now(),
        }
      );
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        // console.log(id, "- " + position);
        position = parseInt(position);
        await Product.updateOne({ _id: id }, { position: position });
      }
      break;
    default:
      break;
  }
  res.redirect("back");
};

const deleteItem = async (req, res) => {
  const id = req.params.id;

  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: Date.now,
      },
    }
  );
  res.redirect("back");
};

// [POST] /admin/products/create
const create = async (req, res) => {
  const record = await ProductCategory.find({ deleted: false });
  const newRecords = createTreeHelper(record);
  res.render("admin/pages/products/create", {
    pageTitle: "Tạo mới sản phẩm",
    records: newRecords,
  });
};

const createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  console.log(req.body);
  req.body.createdBy = {
    account_id: res.locals.user.id,
  };
  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const product = new Product(req.body);
  await product.save();
  // res.flash("success", "Create product successfully!");
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/_id
const edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);
    const record = await ProductCategory.find({ deleted: false });
    const newRecords = createTreeHelper(record);
    res.render("admin/pages/products/edit", {
      pageTitle: "Sửa sản phẩm",
      product: product,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/edit/:id
const editPatch = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  // console.log(req.body);

  req.body.position = parseInt(req.body.position);

  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: Date.now(),
    };

    await Product.updateOne(
      { _id: req.params.id },
      {
        $set: req.body,
        $push: { updatedBy: updatedBy },
      }
    );
    req.flash("success", "Edit product successfully!");
    res.redirect(`back`);
  } catch (error) {
    req.flash("error", "Edit product failed!");
  }
};
// [GET] /admin/products/detail/:id
const detail = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findOne({ _id: id }, { deleted: false });
  // console.log(product);
  res.render("admin/pages/products/detail", {
    pageTitle: "Chi tiết sản phẩm",
    product: product,
  });
};
module.exports = {
  product,
  changeStatus,
  changeMulti,
  deleteItem,
  create,
  createPost,
  edit,
  editPatch,
  detail,
};
