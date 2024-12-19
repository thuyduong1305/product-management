const md5 = require("md5");
const systemConfig = require("../../config/system.js");
const Account = require("../../models/account.model.js");

const login = async (req, res) => {
  if (req.cookie && req.cookie.token) {
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  } else {
    res.render("admin/pages/auth/login", {
      pageTitle: "Đăng nhập tài khoản",
    });
  }
};

const loginPost = async (req, res) => {
  const { email, password } = req.body;
  const user = await Account.findOne({
    deleted: false,
    email: req.body.email,
  });
  if (user) {
    if (user.password === md5(req.body.password)) {
      res.cookie("token", user.token);
      res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    } else {
      req.flash("error", "Mật khẩu không đúng");
      res.redirect("back");
      return;
    }
    if (user.status == "inactive") {
      req.flash("error", "Tài khoản của bạn đã bị khóa");
      res.redirect("back");
      return;
    }
  } else {
    req.flash("error", `Email ${req.body.email} không tồn tại`);
    res.redirect("back");
  }
};
const logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};
module.exports = { login, loginPost, logout };
