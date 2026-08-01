const express = require("express");
const router = express.Router();

const productController = require("../../controllers/productController");

router.get("/", productController.apiGetAll);
router.get("/:id", productController.apiGetById);
router.post("/", productController.apiCreate);
router.put("/:id", productController.apiUpdate);
router.delete("/:id", productController.apiDelete);

module.exports = router;