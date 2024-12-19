const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helper/products");
const Order = require("../../models/order.model");
const index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({ _id: cartId });
  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const product = await Product.findOne({
        _id: item.product_id,
        deleted: false,
      }).select("title thumbnail price slug discountPercentage");
      productHelper.priceNewProduct(product);
      // console.log(productInfo);
      item.productInfo = product;
      item.totalPrice = product.priceNew * item.quantity;
    }
  } else {
  }
  cart.totalPrice = cart.products.reduce(
    (totalPrice, product) => totalPrice + product.totalPrice,
    0
  );
  res.render("client/pages/checkout/index", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart,
  });
};
const order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;

  const cart = await Cart.findOne({ _id: cartId });
  const products = [];
  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const objectProduct = {
        product_id: item.product_id,
        price: 0,
        discountPercentage: 0,
        quantity: item.quantity,
      };
      const product = await Product.findOne({
        _id: item.product_id,
        deleted: false,
      }).select("price discountPercentage");
      productHelper.priceNewProduct(product);
      objectProduct.price = product.price;
      objectProduct.discountPercentage = product.discountPercentage;

      products.push(objectProduct);
    }
    const orderInfo = {
      cart_id: cartId,
      userInfo: userInfo,
      products: products,
    };
    const order = new Order(orderInfo);
    order.save();
    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        $set: {
          products: [],
        },
      }
    );
    res.redirect(`/checkout/success/${order.id}`);
  }
};

const success = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
  });

  order.totalPrice = 0;

  for (const product of order.products) {
    const infoProduct = await Product.findOne({
      _id: product.product_id,
    });

    product.title = infoProduct.title;
    product.thumbnail = infoProduct.thumbnail;

    product.priceNew = (
      (product.price * (100 - product.discountPercentage)) /
      100
    ).toFixed(0);

    product.totalPrice = product.priceNew * product.quantity;

    order.totalPrice += product.totalPrice;
  }

  res.render("client/pages/checkout/success", {
    pageTitle: "Đặt hàng thành công",
    order: order,
  });
};
module.exports = { index, order, success };
