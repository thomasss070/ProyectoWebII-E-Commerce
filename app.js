// ==========================================
// 1. IMPORTACIÓN DE MÓDULOS Y DEPENDENCIAS
// ==========================================
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');

// Base de datos
require('./src/db/database');

// Rutas de la aplicación
const homeRoutes = require('./src/routes/homeRoute');
const authRoutes = require('./src/routes/authRoute');
const productRoutes = require('./src/routes/productRoute');
const cartRoutes = require('./src/routes/cartRoute');
const apiProductRoutes = require('./src/routes/api/apiProductRoute');
const categoryRoutes = require('./src/routes/categoryRoute');
const apiStatsRoute = require('./src/routes/api/apiStatsRoute');
const apiProfileRoute = require("./src/routes/api/apiProfileRoute"); // Ajusta según tu ruta relativa


// Inicialización de Express
const app = express();

// ==========================================
// 2. CONFIGURACIÓN DEL MOTOR DE VISTAS (EJS)
// ==========================================
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');
app.use(expressLayouts); // Activa el middleware de layouts para EJS
app.set('layout', 'layouts/main');

// ==========================================
// 3. MIDDLEWARES GLOBALES Y CONFIGURACIÓN
// ==========================================
// Seguridad y Archivos Estáticos
app.use(cors());
app.use(express.static('public'));

// Parseo del Body (Lectura de JSON y Formulario)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Manejo de Sesiones
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true
}));

// ==========================================
// 4. MIDDLEWARES PERSONALIZADOS
// ==========================================
// Middleware para inicializar y hacer accesible el carrito en todas las vistas
app.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }

    const cart = req.session.cart;

    // Variables disponibles localmente en las plantillas EJS
    res.locals.cart = cart;
    res.locals.totalCart = cart.reduce((sum, item) => {
        return sum + (item.quantity || 0);
    }, 0);

    next();
});

// ==========================================
// 5. RUTAS DE LA APLICACIÓN
// ==========================================

// Rutas Principales de la Web
app.use('/', homeRoutes);
app.use('/', authRoutes);
app.use('/', productRoutes);
app.use('/', cartRoutes);

// Rutas API REST
app.use("/api/users", apiProfileRoute);
app.use('/api/products', apiProductRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stats', apiStatsRoute);

// ==========================================
// 6. MANEJO DE ERRORES
// ==========================================

// 1. CAPTURA RUTAS NO ENCONTRADAS (404)
// Debe ir justo después de todas tus rutas normales y antes del manejador de errores
app.use((req, res, next) => {
    res.status(404).render('layouts/main', {
        body: '../pages/error',
        status: 404,
        mensaje: 'Página no encontrada'
    });
});

// 2. MANEJADOR GLOBAL DE ERRORES DEL SERVIDOR (500 / 400)
// Debe ir al final de todo y llevar exactamente los 4 parámetros (err, req, res, next)
app.use((err, req, res, next) => {
    console.error(err);

    // Determina el código de estado (usa el del error o 500 por defecto)
    const statusCode =  500;
    const mensaje = err.message || 'Error interno del servidor';
    
    res.status(500).render('layouts/main', {
        body: '../pages/error',
        status: 500,
        mensaje: mensaje
    });
});
// ==========================================
// 7. INICIALIZACIÓN DEL SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is Ready on http://localhost:${PORT} 🫡`);
});