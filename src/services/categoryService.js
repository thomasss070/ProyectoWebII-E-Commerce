const db = require("../db/database");

module.exports = {

    findAll() {
        return db.prepare("SELECT * FROM categories").all();
    },

    findById(id) {
        return db.prepare("SELECT * FROM categories WHERE id = ?").get(id);
    },

    create(data) {
        const stmt = db.prepare(`
            INSERT INTO categories (nombre)
            VALUES (?)si
        `);

        const result = stmt.run(data.name);

        return this.findById(result.lastInsertRowid);
    },

    update(id, data) {
        db.prepare(`
            UPDATE categories
            SET nombre = ?
            WHERE id = ?
        `).run(data.name, id);

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