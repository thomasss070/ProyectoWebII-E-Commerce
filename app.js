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
const productRoutes = require('./src/routes/productRoute');
const apiProductRoutes = require('./src/routes/api/apiProductRoute');
const categoryRoutes = require('./src/routes/api/categoryRoute');
const apiStatsRoute = require('./src/routes/api/apiStatsRoute');
const testApiRoutes = require('./src/routes/api/testApiRoutes');

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
// Rutas de Pruebas / API Base
app.use('/api', testApiRoutes);

// Rutas Principales de la Web
app.use('/', productRoutes);

// Rutas API REST
app.use('/api/products', apiProductRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stats', apiStatsRoute);

// ==========================================
// 6. MANEJO DE ERRORES
// ==========================================
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).render('layouts/main', {
        body: '../pages/error',
        status: 500,
        mensaje: 'Error interno del servidor'
    });
});

// ==========================================
// 7. INICIALIZACIÓN DEL SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is Ready on http://localhost:${PORT} 🫡`);
});