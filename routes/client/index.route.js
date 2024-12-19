const express = require("express");
const router = express.Router();

const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const cartRoutes = require("./cart.route");
const searchRoutes = require("./search.route");
const userRoutes = require("./user.route");
const checkoutRoutes = require("./checkout.route");
const chatRoutes = require("./chat.route");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
const settingMiddleware = require("../../middlewares/client/setting.middleware.js");
router.use(categoryMiddleware.category);
router.use(cartMiddleware.carId);
router.use(userMiddleware.infoUser);
router.use(settingMiddleware.settingGeneral);

router.use("/", homeRoutes);
router.use("/products", productRoutes);
router.use("/search", searchRoutes);
router.use("/cart", cartRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/user", userRoutes);
router.use("/chat", chatRoutes);

module.exports = router;
