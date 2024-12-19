const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    product_category_id: {
      type: String,
      default: "",
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
    featured: String,
    createdBy: {
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    // deletedAt: {
    //   type: Date,
    // },
    deletedBy: {
      account_id: String,
      deletedAt: {
        type: Date,
      },
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
