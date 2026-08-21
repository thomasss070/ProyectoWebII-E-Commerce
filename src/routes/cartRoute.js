const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// carrito enviar o crear datos
router.post("/cart/add/:id", productController.addCart);
router.post("/cart/increase", productController.increase);
router.post("/cart/decrease", productController.decrease);
router.post("/cart/remove", productController.remove);

module.exports = router;
