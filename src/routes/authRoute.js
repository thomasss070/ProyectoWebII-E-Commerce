const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");

// login y register
router.get("/login", controller.login);
router.get("/register", controller.register);
router.post("/register", controller.processRegister);

module.exports = router;
