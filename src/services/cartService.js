const db = require("../db/database");


// buscar producto por id
const obtenerProductoPorId = (id) => {
    return db.prepare(`
        SELECT * FROM products WHERE id = ?
    `).get(id);
};



// agregar producto al carrito

function agregarProducto(cart, productId) {

    const producto = obtenerProductoPorId(productId);

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
function obtenerCarrito(cart) {

    return cart.map(item => {

        const producto = obtenerProductoPorId(item.productId);

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
function aumentarCantidad(cart, productId) {

    const item = cart.find(
        p => p.productId === productId
    );

    if (item) {
        item.quantity++;
    }

    return cart;
}


// disminuir cantidad
function disminuirCantidad(cart, productId) {

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
    agregarProducto,
    obtenerCarrito,
    aumentarCantidad,
    disminuirCantidad,
    remove
};