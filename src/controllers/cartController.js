const cartService = require("../services/cartService");
const { parse } = require("uuid");
const normalizeId = require("../utils/normalizeId");
// carrito
const addCart = (req, res) => {
    const id = parseInt(req.params.id);
    cartService.addProduct(req.session.cart, id);
    res.redirect("/cart");
};

const cart = (req, res) => {
    const cartProducts = cartService.getCart(req.session.cart);

    res.render("layouts/main", {
        body: "../pages/cart",
        cart: cartProducts,
        pageCss: "cart"
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

module.exports = { 
    addCart,
    increase,
    decrease,
    remove
    
}
