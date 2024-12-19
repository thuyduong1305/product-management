const Cart = require("../../models/cart.model");
const createTreeHelper = require("../../helper/create-tree.js");

module.exports.carId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    const cart = new Cart();
    await cart.save();
    const expiresCookie = 30 * 24 * 60 * 60 * 1000;
    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresCookie),
    });
  } else {
    const cart = await Cart.findOne({ _id: req.cookies.cartId });
    res.locals.cart = cart;
  }
  next();
};
