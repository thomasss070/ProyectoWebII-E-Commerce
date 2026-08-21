const db = require("../db/database");

// buscar producto por id
const getProductById = (id) => {
    return db.prepare(`
        SELECT * FROM products WHERE id = ?
    `).get(id);
};

// agregar producto al carrito

function addProduct(cart, productId) {

    const producto = getProductById(productId);

    // si no existe en DB no hace nada
    if (!producto) return cart;

    const item = cart.find(
        p => p.productId === productId
    );

    if (item) {
        item.quantity++;
    } else {
        cart.push({
            productId,
            quantity: 1
        });
    }

    return cart;
}

//obtener carrito con datos completos
function getCart(cart) {

    return cart.map(item => {

        const producto = getProductById(item.productId);

        if (!producto) return null;

        return {
            producto: {
                ...producto,
                especificaciones: producto.especificaciones
                    ? JSON.parse(producto.especificaciones)
                    : null
            },
            quantity: item.quantity,
            subtotal: producto.precio * item.quantity
        };
    }).filter(Boolean);
}


//aumentar cantidad
function increaseQuantity(cart, productId) {

    const item = cart.find(
        p => p.productId === productId
    );

    if (item) {
        item.quantity++;
    }

    return cart;
}


// disminuir cantidad
function decreaseQuantity(cart, productId) {

    const item = cart.find(
        p => p.productId === productId
    );

    if (item && item.quantity > 1) {
        item.quantity--;
    }

    return cart;
}


// eliminar producto del carrito
function remove(cart, productId) {

    return cart.filter(
        p => p.productId !== productId
    );
}



module.exports = {
    addProduct,
    getCart,
    increaseQuantity,
    decreaseQuantity,
    remove
};