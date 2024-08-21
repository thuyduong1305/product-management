const Product = require("../../models/product.model.js");

const index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  });
  // console.log(products);

  const newProducts=products.map((item) => {
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

module.exports = {
  index,
};
