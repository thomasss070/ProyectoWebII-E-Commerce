const productsServices = require("../services/productsServices");
const categoryService = require("../services/categoryService");

const statsController = {
    getStats(req, res) {

        const products = productsServices.obtenerTodos();
        const categories = categoryService.findAll();

        return res.json({
            totalProducts: products.length,
            totalCategories: categories.length
        });
    }
};

module.exports = statsController;