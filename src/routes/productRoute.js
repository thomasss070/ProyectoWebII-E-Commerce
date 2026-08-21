const express = require("express");
const router = express.Router();
const normalizeId = require("../utils/normalizeId");
const productController = require("../controllers/productController");

// productos
router.get("/products/order", productController.orderByPrice);
router.get("/search", productController.search);
router.get("/products", productController.products);
router.get("/products/:id", normalizeId, productController.detail); 

module.exports = router;