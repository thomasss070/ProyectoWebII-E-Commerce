const express = require("express");
const router = express.Router();
const normalizeId = require("../utils/normalizeId");
const productController = require("../controllers/productController");
const controller = require("../controllers/productController");

// home
router.get("/", controller.home);

// carrito y checkout
router.get("/cart", controller.cart);
router.get("/checkout", controller.checkout);

// login y register
router.get("/login", controller.login);
router.get("/register", controller.register);
router.post("/register", controller.processRegister);

// productos
router.get("/products/order", productController.orderByPrice);
router.get("/search", controller.search);
router.get("/products", controller.products);
router.get("/products/:id", normalizeId, productController.detail);

// carrito
router.post("/cart/add/:id", controller.addCart);
router.post("/cart/increase", controller.increase);
router.post("/cart/decrease", controller.decrease);
router.post("/cart/remove", controller.remove);

// error
router.get("/error", controller.error);



// 500 TEST (FORZADO)
/*router.get("/error-test", (req, res) => {
  throw new Error("Error de prueba");
});
*/




module.exports = router;