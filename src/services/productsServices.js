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

// crear producto
const crear = (producto) => {
    const result = db.prepare(`
        INSERT INTO products (
            nombre,
            precio,
            imagen,
            descripcion,
            categoria,
            flag,
            stock,
            especificaciones
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        producto.nombre,
        producto.precio,
        producto.imagen,
        producto.descripcion,
        producto.categoria,
        producto.flag,
        producto.stock,
        JSON.stringify(producto.especificaciones)
    );

    return result.lastInsertRowid;
};

// actualizar producto
const actualizar = (id, producto) => {
    return db.prepare(`
        UPDATE products
        SET
            nombre = ?,
            precio = ?,
            imagen = ?,
            descripcion = ?,
            categoria = ?,
            flag = ?,
            stock = ?,
            especificaciones = ?
        WHERE id = ?
    `).run(
        producto.nombre,
        producto.precio,
        producto.imagen,
        producto.descripcion,
        producto.categoria,
        producto.flag,
        producto.stock,
        JSON.stringify(producto.especificaciones),
        id
    );
};

// eliminar producto
const eliminar = (id) => {
    return db.prepare(`
        DELETE FROM products
        WHERE id = ?
    `).run(id);
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    filtrarPorCategoria,
    buscar,
    ordenarPorPrecio,
    obtenerRelacionados,
    obtenerSugeridos,
    crear,
    actualizar,
    eliminar
};
