const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helper/create-tree.js");
const Product = require("../../models/product.model");
const productHelper = require("../../helper/products");
const index = async (req, res) => {
  const keyword = req.query.keyword;
//   console.log(keyword);
  let newProducts = [];
  if (keyword) {
    const keywordRegex = new RegExp(keyword, "i");

    const products = await Product.find({
      deleted: false,
      status: "active",
      title: keywordRegex,
    });
    newProducts = productHelper.priceNewProducts(products);
  }
//   console.log(newProducts);
  res.render("client/pages/search/index", {
    pageTitle: "Kết quả tìm kiếm",
    keyword: keyword,
    products: newProducts,
  });
};

module.exports = { index };
