const db = require("./database"); // ✔ correcto

const fs = require("fs");
const path = require("path");

console.log("Iniciando migración...");

// leer JSON
const productsPath = path.join(
    __dirname,
    "../data/products.json"
);

const products = JSON.parse(
    fs.readFileSync(productsPath, "utf-8")
);

// limpiar tabla
db.prepare("DELETE FROM products").run();

// insertar productos
const insertProduct = db.prepare(`
    INSERT INTO products
    (id, nombre, precio, imagen, descripcion, categoria, flag, stock, especificaciones)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const p of products) {

    insertProduct.run(
        p.id,
        p.nombre,
        p.precio,
        p.imagen,
        p.descripcion,
        p.categoria,
        p.flag,
        p.stock,
        JSON.stringify(p.especificaciones)
    );
}

console.log("Migración completada ✔");