const mongoose = require("mongoose");
const generate = require("../helper/generate.helper");

const accountSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String, default: generate.generateRandomString(20) },
    phone: { type: String },
    avatar: { type: String },
    role_id: { type: String },
    status: { type: String },
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
const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
