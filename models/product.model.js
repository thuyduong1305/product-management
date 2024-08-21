const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  discountPercentage: {
    type: Number,
  },
  stock: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  status: {
    type: String,
  },
  position: {
    type: Number,
  },
  deleted: {
    type: Boolean,
  },
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
