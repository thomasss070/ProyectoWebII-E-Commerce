const express = require("express");
const router = express.Router();

const productController = require("../../controllers/productController");

router.get("/", productController.apiGetAll);
router.get("/:id", productController.apiGetById);
router.post("/", productController.apiCreate);
router.put("/:id", productController.apiUpdate);
router.delete("/:id", productController.apiDelete);
router.get("/categories", productController.apiGetCategories);

module.exports = router;


/* router.get("/", productController.apiGetAll);
Trae la lista con todos los productos para mostrarlos en la tabla del dashboard.

router.get("/:id", productController.apiGetById);
Busca y devuelve un solo producto específico usando su ID (por ejemplo, para ver su detalle antes de editarlo).

router.post("/", productController.apiCreate);
Crea un producto nuevo con los datos que el usuario completó en el formulario del dashboard.

router.put("/:id", productController.apiUpdate);
Edita o actualiza la información de un producto existente identificado por su ID.

router.delete("/:id", productController.apiDelete);
Elimina un producto de la base de datos a partir de su ID.

router.get("/categories", productController.apiGetCategories);
Obtiene la lista de todas las categorías disponibles (muy útil para llenar los desplegables
 o selects cuando creás o filtrás un producto).*/