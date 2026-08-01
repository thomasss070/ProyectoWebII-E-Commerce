const categoryService = require("../services/categoryService");

module.exports = {
    index(req, res) {
        const categories = categoryService.findAll();
        res.status(200).json(categories);
    },

    show(req, res) {
        const category = categoryService.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }

        res.status(200).json(category);
    },

    store(req, res) {
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

    destroy(req, res) {
        const deleted = categoryService.remove(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }

        res.status(200).json({
            message: "Categoría eliminada"
        });
    }
};