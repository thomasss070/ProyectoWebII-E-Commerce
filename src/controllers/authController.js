const bcrypt = require('bcryptjs');
const db = require('../db/database');

const authController = {
  login: (req, res) => {
    res.render('layouts/main', { body: '../pages/login' });
  },

  register: (req, res) => {
    res.render('layouts/main', { body: '../pages/register' });
  },

  // REGISTRO
  processRegister: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }

      // 1. Buscar si existe el usuario usando better-sqlite3
      const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      // 2. Encriptar contraseña
      const passwordHash = await bcrypt.hash(password, 10);

      // 3. Insertar usuario
      const insertQuery = db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)');
      const result = insertQuery.run(name, email, passwordHash, 'Cliente');

      const newUser = { id: result.lastInsertRowid, name, email, role: 'Cliente' };

      if (req.session) {
        req.session.userLogged = newUser;
      }

      return res.status(201).json({ success: true, user: newUser });
    } catch (error) {
      console.error('Error en processRegister:', error);
      return res.status(500).json({ error: 'Error del servidor' });
    }
  },

  // LOGIN CON VALIDACIÓN
  processLogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Ingresa email y contraseña' });
      }

      // 1. Buscar usuario usando better-sqlite3
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // 2. Comprobar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      const userLogged = { id: user.id, name: user.name, email: user.email, role: user.role };

      if (req.session) {
        req.session.userLogged = userLogged;
      }

      return res.json({ success: true, user: userLogged });
    } catch (error) {
      console.error('Error en processLogin:', error);
      return res.status(500).json({ error: 'Error del servidor' });
    }
  },

  // CERRAR SESIÓN
  logout: (req, res) => {
    if (req.session) {
      req.session.destroy();
    }
    return res.json({ success: true, message: 'Sesión cerrada correctamente' });
  }
};

module.exports = authController;