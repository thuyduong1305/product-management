const express = require("express");
const router = express.Router();
const systemConfig = require("../../config/system.js");
const dashboardRoutes = require("./dashboard.route.js");
const productRoutes = require("./product.route.js");
const roleRoutes = require("./role.route.js");
const accountRoutes = require("./account.route.js");
const authRoutes = require("./auth.route.js");
const settingRoutes = require("./setting.route.js");
const myAccountRoutes = require("./my-account.route.js");
const productCategoryRoutes = require("./product-category.route.js");
const PATH_ADMIN = systemConfig.prefixAdmin;
const authMiddleware = require("../../middlewares/admin/auth.middleware.js");

// router.use(authMiddleware.requireAuth);
router.use(
  PATH_ADMIN + "/dashboard",
  authMiddleware.requireAuth,
  dashboardRoutes
);
router.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, roleRoutes);
router.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productRoutes);
router.use(
  PATH_ADMIN + "/products-category",
  authMiddleware.requireAuth,
  productCategoryRoutes
);
router.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRoutes);
router.use(PATH_ADMIN + "/auth", authRoutes);
router.use(
  PATH_ADMIN + "/my-account",
  authMiddleware.requireAuth,
  myAccountRoutes
);
router.use(PATH_ADMIN + "/settings", authMiddleware.requireAuth,settingRoutes);
module.exports = router;
