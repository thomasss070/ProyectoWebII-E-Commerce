const db = require("../db/database");

// Opcional: bcryptjs para encriptar contraseñas
let bcrypt;
try {
    bcrypt = require("bcryptjs");
} catch (e) {
    bcrypt = null; // Si no está instalado, guarda la clave directa
}

const getAllProfiles = () => {
    // Seleccionamos las columnas de tu tabla 
    const query = db.prepare("SELECT id, name, email, role, created_at FROM users");
    return query.all();
};

const getProfileById = (id) => {
    const query = db.prepare("SELECT id, name, email, role, created_at FROM users WHERE id = ?");
    return query.get(id);
};

const createProfile = (data) => {
    const rawPassword = data.password || "123456";
    const passwordHash = bcrypt ? bcrypt.hashSync(rawPassword, 10) : rawPassword;
    const userRole = data.role || "Cliente";

    const query = db.prepare(`
        INSERT INTO users (name, email, password_hash, role)
        VALUES (?, ?, ?, ?)
    `);

    const result = query.run(data.name, data.email, passwordHash, userRole);

    return {
        id: result.lastInsertRowid,
        name: data.name,
        email: data.email,
        role: userRole
    };
};

const updateProfile = (id, data) => {
    const userRole = data.role || "Cliente";
    let query;
    let result;

    if (data.password) {
        const passwordHash = bcrypt ? bcrypt.hashSync(data.password, 10) : data.password;
        query = db.prepare("UPDATE users SET name = ?, email = ?, role = ?, password_hash = ? WHERE id = ?");
        result = query.run(data.name, data.email, userRole, passwordHash, id);
    } else {
        query = db.prepare("UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?");
        result = query.run(data.name, data.email, userRole, id);
    }

    if (result.changes === 0) return null;

    return getProfileById(id);
};

const deleteProfile = (id) => {
    const query = db.prepare("DELETE FROM users WHERE id = ?");
    const result = query.run(id);

    return result.changes > 0;
};

module.exports = {
    getAllProfiles,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile
};