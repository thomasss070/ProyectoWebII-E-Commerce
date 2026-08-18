const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Vistas (GET)
router.get('/login', authController.login);
router.get('/register', authController.register);

// Procesos (POST)
router.post('/login', authController.processLogin);
router.post('/register', authController.processRegister);

// Cerrar sesión
router.get('/logout', authController.logout);

module.exports = router;