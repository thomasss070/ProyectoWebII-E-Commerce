const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const db = new Database("./src/db/database.db");

// leer schema.sql
const schema = fs.readFileSync(
    path.join(__dirname, "schema.sql"),
    "utf-8"
);
// ejecutar SQL
db.exec(schema);

// Asegurar que la columna stock exista en products para bases de datos antiguas
const info = db.prepare(`PRAGMA table_info(products)`).all();
const hasStock = info.some(column => column.name === "stock");
if (!hasStock) {
    db.exec(`ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0`);
}

console.log("Base de datos inicializada ✔");

module.exports = db;

