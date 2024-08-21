const express = require("express");
const router = express.Router();

const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");


router.use("/products", productRoutes);
router.use("/", homeRoutes);

module.exports = router;
