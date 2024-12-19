const generateHelper = require("../../helper/generate.helper");
const sendMailHelper = require("../../helper/sendMail");

const md5 = require("md5");
const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");
const ForgotPassword = require("../../models/forgot-password.model");
const register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký",
  });
};
const registerPost = async (req, res) => {
  const emailExit = await User.findOne({
    deleted: false,
    email: req.body.email,
  });
  //   console.log(emailExit);
  if (emailExit) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
    res.redirect("back");
  } else {
    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();
    res.cookie("tokenUser", user.tokenUser);
    res.redirect(`/`);
  }
};
const login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập",
  });
};
const loginPost = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    deleted: false,
    email: req.body.email,
  });
  if (user) {
    if (user.password === md5(req.body.password)) {
      const cart = await Cart.findOne({ user_id: user.id });
      if (cart) {
        res.cookie("cartId", cart._id);
      } else {
        await Cart.updateOne(
          {
            _id: req.cookies.cartId,
          },
          {
            user_id: user.id,
          }
        );
      }

      res.cookie("tokenUser", user.tokenUser);
      res.redirect(`/`);
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
  res.clearCookie("tokenUser");
  res.clearCookie("cartId");
  res.redirect(`/user/login`);
};
const forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Quên mật khẩu",
  });
};
const forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }

  const otp = generateHelper.generateRandomNumber(8);

  // Việc 1: Lưu thông tin vào database
  const objectForgotPassword = {
    email: email,
    otp: otp,
  };

  const record = new ForgotPassword(objectForgotPassword);
  await record.save();

  // Việc 2: Gửi mã OTP qua email
  const subject = `Mã OTP lấy lại lại mật khẩu`;
  const content = `Mã OTP của bạn là <b>${otp}</b>. Vui lòng không chia sẻ với bất cứ ai.`;

  sendMailHelper.sendMail(email, subject, content);

  res.redirect(`/user/password/otp?email=${email}`);
};
const otpPassword = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhập mã OTP",
    email: email,
  });
};

const otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const find = {
    email: email,
    otp: otp,
  };

  const result = await ForgotPassword.findOne(find);

  if (!result) {
    req.flash("error", "OTP không hợp lệ!");
    res.redirect("back");
    return;
  }

  const user = await User.findOne({
    email: email,
  });

  res.cookie("tokenUser", user.tokenUser);

  res.redirect(`/user/password/reset`);
};
const resetPassword = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/reset-password", {
    pageTitle: "Đặt lại mật khẩu",
    email: email,
  });
};
const resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  try {
    await User.updateOne(
      {
        tokenUser: tokenUser,
      },
      {
        password: md5(password),
      }
    );

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

const info = async (req, res) => {
  res.render("client/pages/user/info", {
    pageTitle: "Thông tin tài khoản",
  });
};
module.exports = {
  register,
  registerPost,
  login,
  loginPost,
  logout,
  forgotPassword,
  forgotPasswordPost,
  otpPassword,
  otpPasswordPost,
  resetPassword,
  resetPasswordPost,
  info,
};
