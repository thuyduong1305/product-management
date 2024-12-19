const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const index = (req, res) => {
  res.render("admin/pages/my-account/index", {
    pageTitle: "Trang cá nhân",
  });
};

const edit = async (req, res) => {
  const roles = await Role.find({ deleted: false });
  try {
    res.render("admin/pages/my-account/edit", {
      pageTitle: "Sửa tài khoản",
      roles: roles,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/my-account`);
  }
};

const editPatch = async (req, res) => {
  const emailExit = await Account.findOne({
    _id: { $ne: req.locals.user.id },
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
    await Account.updateOne({ _id: req.locals.user.id }, req.body);
    req.flash("success", "Edit account successfully!");
  }
  res.redirect(`back`);
};
module.exports = { index, edit, editPatch };
