const db = require("../db/database");

// Obtener todos los productos
const obtenerTodos = () => {
    const productos = db.prepare('SELECT * FROM products').all();

    return productos.map((prod) => {
        let especificaciones = prod.especificaciones;

        if (especificaciones) {
            try {
                especificaciones = JSON.parse(especificaciones);
            } catch (error) {
                especificaciones = prod.especificaciones;
            }
        }

        return {
            ...prod,
            especificaciones
        };
    });
};

// Obtener producto por ID
const obtenerPorId = (id) => {
    const producto = db.prepare(`
        SELECT * FROM products WHERE id = ?
    `).get(id);

    if (!producto) return null;

    let especificacionesParsed = null;

    if (producto.especificaciones) {
        try {
            especificacionesParsed = JSON.parse(producto.especificaciones);
        } catch (e) {
            especificacionesParsed = producto.especificaciones;
        }
    }

    return {
        ...producto,
        especificaciones: especificacionesParsed
    };
};

// Obtener todas las categorías
const obtenerCategorias = () => {
    return db.prepare('SELECT * FROM categories').all();
};

// Filtrar productos por ID de categoría (categoria_id)
const obtenerPorCategoria = (categoriaId) => {
    return db.prepare(`
        SELECT * FROM products 
        WHERE CAST(categoria_id AS INTEGER) = ?
    `).all(categoriaId);
};

// Buscar por nombre
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

// Ordenar por precio 
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

// Obtener relacionados 
const obtenerRelacionados = (producto) => {
    const productos = db.prepare(`
        SELECT * FROM products
        WHERE categoria_id = ?
        AND id != ?
        LIMIT 3
    `).all(producto.categoria_id, producto.id);

    return productos.map(p => ({
        ...p,
        especificaciones: p.especificaciones
            ? JSON.parse(p.especificaciones)
            : null
    }));
};

// Obtener sugeridos aleatorios 
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

const normalizarCategoriaId = (valor, productoExistente = null) => {
    if (valor === null || valor === '' || valor === 'null') {
        return null;
    }

    if (valor === undefined) {
        return productoExistente?.categoria_id ?? null;
    }

    if (typeof valor === 'number') {
        return Number.isFinite(valor) ? Math.trunc(valor) : (productoExistente?.categoria_id ?? null);
    }

    if (typeof valor === 'string') {
        const texto = valor.trim();

        if (texto === '' || texto === 'null') {
            return null;
        }

        const numerico = Number(texto);
        if (!Number.isNaN(numerico)) {
            return Math.trunc(numerico);
        }

        const categoria = db.prepare('SELECT id FROM categories WHERE nombre = ?').get(texto);
        return categoria ? categoria.id : (productoExistente?.categoria_id ?? null);
    }

    return productoExistente?.categoria_id ?? null;
};

// Crear producto
const crear = (producto) => {
    const categoriaId = normalizarCategoriaId(producto.categoria_id ?? producto.category_id ?? producto.categoria);

    const result = db.prepare(`
        INSERT INTO products (
            nombre,
            precio,
            imagen,
            descripcion,
            categoria_id,
            flag,
            stock,
            especificaciones
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        producto.nombre || null,
        producto.precio || 0,
        producto.imagen || null,
        producto.descripcion || null,
        categoriaId,
        producto.flag || null,
        producto.stock || 0,
        producto.especificaciones ? JSON.stringify(producto.especificaciones) : null
    );

    return result.lastInsertRowid;
};

// Actualizar producto
const actualizar = (id, producto) => {
    const numericId = !isNaN(id) ? Number(id) : id;

    // 1. Obtenemos los datos actuales del producto desde SQLite
    const productoExistente = db.prepare('SELECT * FROM products WHERE id = ?').get(numericId);

    if (!productoExistente) {
        return { changes: 0 };
    }

    // 2. Normalizar la categoría permitiendo explicitamente 'null' o vacíos
    let cleanCategoryId = productoExistente.categoria_id;
    if (producto.categoria_id !== undefined || producto.category_id !== undefined) {
        const rawCat = producto.categoria_id ?? producto.category_id;
        cleanCategoryId = normalizarCategoriaId(rawCat, productoExistente);
    }

    // 3. Fusionar valores
    const merged = {
        nombre: (producto.nombre && String(producto.nombre).trim() !== '') ? producto.nombre : productoExistente.nombre,
        precio: (producto.precio !== undefined && producto.precio !== null && !isNaN(producto.precio)) ? producto.precio : productoExistente.precio,
        imagen: (producto.imagen && String(producto.imagen).trim() !== '') ? producto.imagen : productoExistente.imagen,
        descripcion: (producto.descripcion && String(producto.descripcion).trim() !== '') ? producto.descripcion : productoExistente.descripcion,
        categoria_id: cleanCategoryId,
        flag: (producto.flag && String(producto.flag).trim() !== '') ? producto.flag : productoExistente.flag,
        stock: (producto.stock !== undefined && producto.stock !== null && !isNaN(producto.stock)) ? producto.stock : productoExistente.stock,
        especificaciones: (producto.especificaciones !== undefined && producto.especificaciones !== null) 
            ? producto.especificaciones 
            : productoExistente.especificaciones
    };

    // 4. Formatear especificaciones en caso de que vengan como objeto JSON
    let specsParaGuardar = merged.especificaciones;
    if (typeof specsParaGuardar === 'object' && specsParaGuardar !== null) {
        specsParaGuardar = JSON.stringify(specsParaGuardar);
    }

    // 5. Ejecutar el UPDATE
    return db.prepare(`
        UPDATE products
        SET
            nombre = ?,
            precio = ?,
            imagen = ?,
            descripcion = ?,
            categoria_id = ?,
            flag = ?,
            stock = ?,
            especificaciones = ?
        WHERE id = ?
    `).run(
        merged.nombre,
        merged.precio,
        merged.imagen,
        merged.descripcion,
        merged.categoria_id,
        merged.flag,
        merged.stock,
        specsParaGuardar,
        numericId
    );
};

// Eliminar producto
const eliminar = (id) => {
    const numericId = !isNaN(id) ? Number(id) : id;

    return db.prepare(`
        DELETE FROM products
        WHERE id = ?
    `).run(numericId);
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    obtenerCategorias,
    obtenerPorCategoria,
    buscar,
    ordenarPorPrecio,
    obtenerRelacionados,
    obtenerSugeridos,
    crear,
    actualizar,
    eliminar
};