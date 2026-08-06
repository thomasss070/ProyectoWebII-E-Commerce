const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");

// home
router.get("/", controller.home);

// carrito y checkout
router.get("/cart", controller.cart);
router.get("/checkout", controller.checkout);

// error
router.get("/error", controller.error);

module.exports = router;
