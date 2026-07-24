const db = require("../db/database");

//obtener todos
const obtenerTodos = () => {
    const productos = db.prepare(`
        SELECT * FROM products
    `).all();

    return productos.map(p => ({
        ...p,
        especificaciones: p.especificaciones
            ? JSON.parse(p.especificaciones)
            : null
    }));
};


//obtener por id

const obtenerPorId = (id) => {
       const producto = db.prepare(`
        SELECT * FROM products WHERE id = ?
    `).get(id);

    if (!producto) return null;

    return {
        ...producto,
        especificaciones: producto.especificaciones
            ? JSON.parse(producto.especificaciones)
            : null
    };
};




//filtrar por categoria
const filtrarPorCategoria = (categoria) => {
    const productos = db.prepare(`
        SELECT * FROM products
        WHERE categoria = ?
    `).all(categoria);

    return productos.map(p => ({
        ...p,
        especificaciones: p.especificaciones
            ? JSON.parse(p.especificaciones)
            : null
    }));
};


// buscar por nombre
const buscar = (nombre) => {
    const productos = db.prepare(`
        SELECT * FROM products
        WHERE nombre LIKE ?
    `).all(`%${nombre}%`);

    return productos.map(p => ({
        ...p,
        especificaciones: p.especificaciones
            ? JSON.parse(p.especificaciones)
            : null
    }));
};

//ordenar por precio 


function ordenarPorPrecio(orden = "asc") {

    if (orden === "desc") {

        return db.prepare(`
            SELECT * FROM products
            ORDER BY precio DESC
        `).all();
    }

    return db.prepare(`
        SELECT * FROM products
        ORDER BY precio ASC
    `).all();
}

module.exports = {
    ordenarPorPrecio
};

//obtener relacionados 
const obtenerRelacionados = (producto) => {
    const productos = db.prepare(`
        SELECT * FROM products
        WHERE categoria = ?
        AND id != ?
        LIMIT 3
    `).all(producto.categoria, producto.id);

    return productos.map(p => ({
        ...p,
        especificaciones: p.especificaciones
            ? JSON.parse(p.especificaciones)
            : null
    }));
};

//obtener sugeridos aleatorios 

const obtenerSugeridos = () => {
    const productos = db.prepare(`
        SELECT * FROM products
        ORDER BY RANDOM()
        LIMIT 4
    `).all();

    return productos.map(p => ({
        ...p,
        especificaciones: p.especificaciones
            ? JSON.parse(p.especificaciones)
            : null
    }));
};


module.exports = {
    obtenerTodos,
    obtenerPorId,
    filtrarPorCategoria,
    buscar,
    ordenarPorPrecio,
    obtenerRelacionados,
    obtenerSugeridos
};