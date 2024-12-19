const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helper/create-tree.js");

module.exports.category = async (req, res, next) => {
  const records = await ProductCategory.find({ deleted: false });
  const newRecords = createTreeHelper(records);
  res.locals.layoutProductsCategory = newRecords;
  next();
};
