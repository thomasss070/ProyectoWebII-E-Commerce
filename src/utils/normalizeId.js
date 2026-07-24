const db = require("../db/database");

function normalizeId(req, res, next) {

    const id = parseInt(req.params.id);

    // validar número
    if (isNaN(id)) {
    return res.status(400).render("layouts/main", {
        body: "../pages/error",
        status: 400,
        mensaje: "ID inválido (debe ser numérico)"
    });
}

    // validar existencia en DB
    const product = db.prepare(
        "SELECT id FROM products WHERE id = ?"
    ).get(id);

    if (!product) {
        return res.status(404).render("layouts/main", {
            body: "../pages/error",
            mensaje: "Producto no encontrado"
        });
    }

    req.params.id = id;
    next();
}

module.exports = normalizeId;