const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

//Los dos GET: Son para pedir información. Uno trae la lista completa de categorías y el otro busca solo una usando su ID.
//El POST: Es para recibir información nueva y Crear una categoría.
//El PUT: Es para Editar una categoría que ya existe.
//El DELETE: Es para Borrar una categoría específica.
router.get("/", categoryController.getAll); //lista todas las categorías
router.get("/:id", categoryController.getById);
router.post("/", categoryController.create); //guardar una nueva categoría
router.put("/:id", categoryController.update);
router.delete("/:id", categoryController.delete);

module.exports = router; //para que se pueda usar en otros archivos, exportamos el router