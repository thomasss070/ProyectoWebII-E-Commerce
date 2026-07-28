const productsService = require("../services/productsServices");
const cartService = require("../services/cartService");
const { parse } = require("uuid");
const normalizeId = require("../utils/normalizeId");

// home
const home = (req, res) => {

    const productos = productsService.obtenerTodos();

    res.render("layouts/main", {
        body: "../pages/index",
        productos,
    });
};


// buscar
const search = (req, res) => {

    const query = req.query.q;

    const resultados = productsService.buscar(query);

    res.render("layouts/main", {
        body: "../pages/index",
        productos: resultados,
    });
};


// listado de productos
const products = (req, res) => {

    const productos = productsService.obtenerTodos();

    res.render("layouts/main", {
        body: "../pages/index",
        productos,
    });
};


// detalle de producto
const detail = (req, res) => {

    const producto = productsService.obtenerPorId(req.params.id);

    //  404 
    if (!producto) {

        const sugeridos = productsService.obtenerTodos().slice(0, 3);

        return res.status(404).render("layouts/main", {
            body: "../pages/error",
            status: 404,
            mensaje: "Producto no encontrado",
            sugeridos
        });
    }

    const relacionados = productsService.obtenerTodos().slice(0, 3);

    res.render("layouts/main", {
        body: "../pages/products",
        producto,
        relacionados
    });
};

// carrito
const addCart = (req, res) => {

    const id = parseInt(req.params.id);

    cartService.agregarProducto(req.session.cart, id);

    res.redirect("/cart");
};

const cart = (req, res) => {

    const cartProducts = cartService.obtenerCarrito(req.session.cart);

    res.render("layouts/main", {
        body: "../pages/cart",
        cart: cartProducts
    });
};

const increase = (req, res) => {

    const id = parseInt(req.body.id);

    cartService.aumentarCantidad(req.session.cart, id);

    res.redirect("/cart");
};

const decrease = (req, res) => {

    const id = parseInt(req.body.id);

    cartService.disminuirCantidad(req.session.cart, id);

    res.redirect("/cart");
};

const remove = (req, res) => {

    const id = parseInt(req.body.id);

    req.session.cart = cartService.remove(req.session.cart, id);

    res.redirect("/cart");
};


// checkout
const checkout = (req, res) => {

    res.render("layouts/main", {
        body: "../pages/checkout"
    });
};


// login y register
const login = (req, res) => {
    res.render("pages/login");
};

const register = (req, res) => {
    res.render("pages/register");
};

const processRegister = (req, res) => {
    console.log(req.body);
    res.redirect("/login");
};


// error
const error = (req, res) => {

    const sugeridos = productsService.obtenerTodos().slice(0, 2);

    res.status(404).render("layouts/main", {
        body: "../pages/error",
        mensaje: "Página no encontrada",
        sugeridos
    });
};

const orderByPrice = (req, res) => {

    const orden = req.query.orden;

    const productos =
        productsService.ordenarPorPrecio(orden);

    res.render("layouts/main", {
        body: "../pages/index",
        productos
    });
};

// API - Obtener todos los productos
const apiGetAll = (req, res) => {
    const productos = productsService.obtenerTodos();

    res.status(200).json(productos);
};

// API - Obtener un producto por ID
const apiGetById = (req, res) => {
    const producto = productsService.obtenerPorId(req.params.id);

    if (!producto) {
        return res.status(404).json({
            error: "Producto no encontrado"
        });
    }

    res.status(200).json(producto);
};

// API - Crear un producto
const apiCreate = (req, res) => {
    const id = productsService.crear(req.body);

    res.status(201).json({
        message: "Producto creado",
        id
    });
};

// API - Actualizar un producto
const apiUpdate = (req, res) => {
    productsService.actualizar(req.params.id, req.body);

    res.status(200).json({
        message: "Producto actualizado"
    });
};

// API - Eliminar un producto
const apiDelete = (req, res) => {
    productsService.eliminar(req.params.id);

    res.status(200).json({
        message: "Producto eliminado"
    });
};


module.exports = {
    home,
    cart,
    checkout,
    login,
    register,
    search,
    products,
    detail,
    addCart,
    increase,
    decrease,
    remove,
    error,
    processRegister,
    orderByPrice,
    // API
    apiGetAll,
    apiGetById,
    apiCreate,
    apiUpdate,
    apiDelete
};