const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const session = require('express-session');
require("./src/db/database");
const app = express();

const productRoutes = require('./src/routes/productRoute');

// 1. VIEW ENGINE (PRIMERO SIEMPRE)
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');

// 2. MIDDLEWARES BASE
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true
}));

// 3. CART MIDDLEWARE
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }

  const cart = req.session.cart;

  res.locals.cart = cart;

  res.locals.totalCart = cart.reduce((sum, item) => {
    return sum + (item.quantity || 0);
  }, 0);

  next();
});


app.use("/", productRoutes);



app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).render("layouts/main", {
        body: "../pages/error",
        status: 500,
        mensaje: "Error interno del servidor"
    });

});



// 6. SERVER
app.listen(3001, () => {
  console.log("Server is Ready! 🫡");
});