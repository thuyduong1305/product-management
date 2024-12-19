const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helper/create-tree.js");
const Product = require("../../models/product.model");
const productHelper = require("../../helper/products");
const index = async (req, res) => {
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).limit(6);

  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(6);

  const newProductsFeatured = productHelper.priceNewProducts(productsFeatured);
  const newProductsNew = productHelper.priceNewProducts(productsNew);
  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew,
  });
};

module.exports = { index };
