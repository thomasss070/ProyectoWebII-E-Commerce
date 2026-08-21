const express = require("express");
const router = express.Router();
const CartController = require("../controllers/CartController");

// carrito enviar o crear datos
router.post("/cart/add/:id", CartController.addCart);
router.post("/cart/increase", CartController.increase);
router.post("/cart/decrease",  CartController.decrease);
router.post("/cart/remove", CartController.remove);

module.exports = router;
