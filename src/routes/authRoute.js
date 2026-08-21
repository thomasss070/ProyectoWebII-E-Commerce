const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const controller = require('../controllers/authController');

// login y register
router.get("/login", controller.login);
router.get("/register", controller.register);
router.post("/register", controller.processRegister); // para procesar el registro de un usuario

// Procesos (POST)
router.post('/login', authController.processLogin);
router.post('/register', authController.processRegister);

// Cerrar sesión
router.get('/logout', authController.logout);

module.exports = router;