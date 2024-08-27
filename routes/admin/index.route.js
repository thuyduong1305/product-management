const express = require("express");
const router = express.Router();
const systemConfig = require("../../config/system.js");
const dashboardRoutes = require("./dashboard.route.js");
const productRoutes = require("./product.route.js");
const PATH_ADMIN = systemConfig.prefixAdmin;
router.use(PATH_ADMIN + "/dashboard", dashboardRoutes);
router.use(PATH_ADMIN + "/products", productRoutes);

module.exports = router;
