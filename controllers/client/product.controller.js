const Product = require("../../models/product.model.js");
const ProductCategory = require("../../models/product-category.model.js");
const productHelper = require("../../helper/products");
// [GET] /products
const index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });
  // console.log(products);

  const newProducts = productHelper.priceNewProducts(products);
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
  if (product.product_category_id) {
    const category = await ProductCategory.findOne({
      _id: product.product_category_id,
      status: "active",
      deleted: false,
    });

    product.category = category;
  }
  product.priceNew = productHelper.priceNewProduct(product);
  res.render("client/pages/products/detail", {
    pageTitle: "Chi tiết sản phẩm",
    product: product,
  });
};
const category = async (req, res) => {
  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    deleted: false,
  });
  const getSubCategory = async (parentId) => {
    const subs = await ProductCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: false,
    });

    let allSubs = [...subs];

    for (const sub of subs) {
      const childs = await getSubCategory(sub.id);
      allSubs = allSubs.concat(childs);
    }

    return allSubs;
  };
  const allCategory = await getSubCategory(category.id);

  const allCategoryId = allCategory.map((item) => item.id);
  const products = await Product.find({
    deleted: false,
    status: "active",
    product_category_id: { $in: [category.id, ...allCategoryId] },
  }).sort({ position: "desc" });

  res.render("client/pages/products/index", {
    pageTitle: category.title,
    products: products,
  });
};
module.exports = {
  index,
  detail,
  category,
};
