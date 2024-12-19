const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
var md5 = require("md5");
const index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Account.find(find).select("-password -token");
  for (const record of records) {
    const role = await Role.findOne({ _id: record.role_id, deleted: false });
    record.role = role;
  }
  res.render("admin/pages/accounts/index", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  });
};
const create = async (req, res) => {
  const roles = await Role.find({ deleted: false });
  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo mới tài khoản",
    roles: roles,
  });
};
const createPost = async (req, res) => {
  const emailExit = await Account.findOne({
    deleted: false,
    email: req.body.email,
  });
  console.log(emailExit);
  if (emailExit) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
    res.redirect("back");
  } else {
    req.body.password = md5(req.body.password);
    const record = new Account(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

const edit = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted: false,
  };
  const data = await Account.findOne(find);
  const roles = await Role.find({ deleted: false });
  res.render("admin/pages/accounts/edit", {
    pageTitle: "Sửa tài khoản",
    data: data,
    roles: roles,
  });
};

const editPatch = async (req, res) => {
  const emailExit = await Account.findOne({
    _id: { $ne: req.params.id },
    deleted: false,
    email: req.body.email,
  });
  if (emailExit) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    await Account.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", "Edit account successfully!");
  }
  res.redirect(`back`);
};
module.exports = { index, create, createPost, edit, editPatch };
