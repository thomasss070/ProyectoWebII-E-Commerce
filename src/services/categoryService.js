const db = require("../db/database");

module.exports = {

    findAll() {
        return db.prepare("SELECT * FROM categories").all();
    },

    findById(id) {
        return db.prepare("SELECT * FROM categories WHERE id = ?").get(id);
    },

    create(data) {
        const nombre = data.nombre ?? data.name ?? null;
        const descripcion = data.descripcion ?? data.description ?? null;

        const stmt = db.prepare(`
            INSERT INTO categories (nombre, descripcion)
            VALUES (?, ?)
        `);

        const result = stmt.run(nombre, descripcion);

        return this.findById(result.lastInsertRowid);
    },

    update(id, data) {
        const nombre = data.nombre ?? data.name ?? null;
        const descripcion = data.descripcion ?? data.description ?? null;

        db.prepare(`
            UPDATE categories
            SET nombre = ?, descripcion = ?
            WHERE id = ?
        `).run(nombre, descripcion, id);

        return this.findById(id);
    },

    remove(id) {
        const result = db.prepare(`
            DELETE FROM categories
            WHERE id = ?
        `).run(id);

        return result.changes > 0;
    }

};