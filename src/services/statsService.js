const productsServices = require("./productsServices");
const categoryService = require("./categoryService");

const statsService = {

    getStats() {
        return {
            totalProducts: productsServices.obtenerTodos().length,
            totalCategories: categoryService.findAll().length
        };
    }

};

module.exports = statsService;