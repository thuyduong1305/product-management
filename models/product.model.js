const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    slug: { type: String, slug: "title", unique: true },
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
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
