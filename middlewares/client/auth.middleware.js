const systemConfig = require("../../config/system.js");
const User = require("../../models/user.model");
module.exports.requireAuth = async (req, res, next) => {
  if (req.cookies && req.cookies.tokenUser) {
    const user = await User.findOne({ tokenUser: req.cookies.tokenUser });
    if (!user) {
      res.redirect(`/user/login`);
      return;
    } else {
      
      res.locals.user = user;
      next();
    }
  } else {
    res.redirect(`/user/login`);
  }
};
