const db = require("../db/database");

//obtener todos
// CÓDIGO CORREGIDO Y SEGURO
const obtenerTodos = () => {
    const productos = db.prepare('SELECT * FROM products').all();

    return productos.map((prod) => {
        let especificaciones = prod.especificaciones;

        if (especificaciones) {
            try {
                // Intentamos convertirlo solo si es un JSON válido
                especificaciones = JSON.parse(especificaciones);
            } catch (error) {
                // Si no es un JSON válido (como "akdlsakds"), dejamos el texto tal cual
                especificaciones = prod.especificaciones;
            }
        }

        return {
            ...prod,
            especificaciones
        };
    });
};


//obtener por id

const obtenerPorId = (id) => {
    const producto = db.prepare(`
        SELECT * FROM products WHERE id = ?
    `).get(id);

    if (!producto) return null;

    let especificacionesParsed = null;

    if (producto.especificaciones) {
        try {
            // Intentamos parsear si es un JSON estructurado
            especificacionesParsed = JSON.parse(producto.especificaciones);
        } catch (e) {
            // Si es texto plano (como "pantalla: ..."), conservamos el texto sin romper
            especificacionesParsed = producto.especificaciones;
        }
    }

    return {
        ...producto,
        especificaciones: especificacionesParsed
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
    const numericId = !isNaN(id) ? Number(id) : id;

    // 1. Obtenemos los datos actuales del producto desde SQLite
    const productoExistente = db.prepare('SELECT * FROM products WHERE id = ?').get(numericId);

    if (!productoExistente) {
        return { changes: 0 };
    }

    // 2. Si un campo viene como undefined o null/vacío no deseado, retenemos el valor original
    const merged = {
        nombre: (producto.nombre && producto.nombre.trim() !== '') ? producto.nombre : productoExistente.nombre,
        precio: (producto.precio !== undefined && producto.precio !== null && !isNaN(producto.precio)) ? producto.precio : productoExistente.precio,
        imagen: (producto.imagen && producto.imagen.trim() !== '') ? producto.imagen : productoExistente.imagen,
        descripcion: (producto.descripcion && producto.descripcion.trim() !== '') ? producto.descripcion : productoExistente.descripcion,
        categoria: (producto.categoria && producto.categoria.trim() !== '') ? producto.categoria : productoExistente.categoria,
        flag: (producto.flag && producto.flag.trim() !== '') ? producto.flag : productoExistente.flag,
        stock: (producto.stock !== undefined && producto.stock !== null && !isNaN(producto.stock)) ? producto.stock : productoExistente.stock,
        especificaciones: (producto.especificaciones !== undefined && producto.especificaciones !== null && producto.especificaciones !== '') 
            ? producto.especificaciones 
            : productoExistente.especificaciones
    };

    // 3. Formateamos las especificaciones en caso de que vengan como objeto JSON
    let specsParaGuardar = merged.especificaciones;
    if (typeof specsParaGuardar === 'object' && specsParaGuardar !== null) {
        specsParaGuardar = JSON.stringify(specsParaGuardar);
    }

    // 4. Ejecutamos el UPDATE con los datos combinados
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
        merged.nombre,
        merged.precio,
        merged.imagen,
        merged.descripcion,
        merged.categoria,
        merged.flag,
        merged.stock,
        specsParaGuardar,
        numericId
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
