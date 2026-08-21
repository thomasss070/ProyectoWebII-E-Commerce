const categoryService = require("../services/categoryService");
// Importa el servicio donde realmente ocurre la lógica para manipular los datos de categorías.

module.exports = { //Exporta un objeto con 5 funciones para que el archivo de rutas (router) las pueda usar.
    getAll(req, res) { //lista TODO 
        const categories = categoryService.findAll();// busca todas las careogorias 
                res.status(200).json(categories);
    },

    getById(req, res) {//  muestra una categoria por id
        const category = categoryService.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }

        res.status(200).json(category);
    },

    create(req, res) {
        const category = categoryService.create(req.body);
        res.status(201).json(category);
    },

    update(req, res) {
        const category = categoryService.update(req.params.id, req.body);

        if (!category) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }

        res.status(200).json(category);
    },

    delete(req, res) {
        const deleted = categoryService.remove(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }

        res.status(200).json({
            message: "Categoría eliminada"
        });
    }
};