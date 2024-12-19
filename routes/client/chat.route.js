const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/client/auth.middleware");
const controller = require("../../controllers/client/chat.controller");
router.get("/", authMiddleware.requireAuth, controller.index);

module.exports = router;
