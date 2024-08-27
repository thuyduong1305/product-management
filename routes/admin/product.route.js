const express = require("express");
const router = express.Router();
const multer = require("multer");
const storageMulter = require("../../helper/storageMulter");
const upload = multer({ storage: storageMulter() });
const app = express();
const validate = require("../../validates/admin/product.validate");
const controller = require("../../controllers/admin/product.controller");
router.get("/", controller.product);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItem);
router.get("/create", controller.create);
router.get("/edit/:id", controller.edit);
router.get("/detail/:id", controller.detail);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  validate.createPost,
  controller.editPatch
);
router.post(
  "/create",
  upload.single("thumbnail"),
  validate.createPost,
  controller.createPost
);

module.exports = router;
