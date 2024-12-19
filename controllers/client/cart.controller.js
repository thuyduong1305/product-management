const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helper/products");
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
  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart,
  });
};

const addPost = async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({ _id: cartId });
  //   console.log(cart);
  const existProductInCart = cart.products.find(
    (item) => item.product_id == productId
  );
  if (existProductInCart) {
    const quantityNew = quantity + existProductInCart.quantity;
    await Cart.updateOne(
      {
        _id: cartId,
        "products.product_id": productId,
      },
      {
        $set: { "products.$.quantity": quantityNew },
      }
    );
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };
    await Cart.updateOne(
      {
        _id: cartId,
      },
      { $push: { products: objectCart } }
    );
  }

  res.redirect("back");
};

const del = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  await Cart.updateOne(
    { _id: cartId },
    {
      $pull: { products: { product_id: productId } },
    }
  );

  req.flash("success", "Xóa sản phẩm thành công");
  res.redirect("back");
};
const update = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = req.params.quantity;
  await Cart.updateOne(
    {
      _id: cartId,
      "products.product_id": productId,
    },
    {
      $set: { "products.$.quantity": quantity },
    }
  );

  req.flash("success", "Cập nhật sản phẩm thành công");
  res.redirect("back");
};
module.exports = { addPost, index, del, update };
