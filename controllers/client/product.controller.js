const Product = require("../../models/product.model.js");

// [GET] /products
const index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });
  // console.log(products);

  const newProducts = products.map((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(0);
    return item;
  });
  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
  });
};

// [GET] /products/:slug
const detail = async (req, res) => {
  const product = await Product.findOne({
    deleted: false,
    status: "active",
    slug: req.params.slug,
  });

  res.render("client/pages/products/detail", {
    pageTitle: "Chi tiết sản phẩm",
    product: product,
  });
};
module.exports = {
  index,
  detail,
};
