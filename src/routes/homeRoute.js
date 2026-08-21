const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");
const cartController = require("../controllers/cartController");

// home pedir o ver productos
router.get("/", controller.home);

// carrito y checkout
router.get("/checkout", controller.checkout);

// error 
router.get("/error", controller.error);

module.exports = router;
