const productsServices = require("../services/productsServices");
const cartService = require("../services/cartService");
const { parse } = require("uuid");
const normalizeId = require("../utils/normalizeId");

// home
const home = (req, res) => {
    const productos = productsServices.obtenerTodos();
    const categorias = productsServices.obtenerCategorias ? productsServices.obtenerCategorias() : [];

    res.render("layouts/main", {
        body: "../pages/index",
        productos,
        categorias,
        pageCss: "index"
    });
};

// buscar
const search = (req, res) => {
    const query = req.query.q;
    const resultados = productsServices.buscar(query);
    const categorias = productsServices.obtenerCategorias ? productsServices.obtenerCategorias() : [];

    res.render("layouts/main", {
        body: "../pages/index",
        productos: resultados,
        categorias,
        pageCss: "index"
    });
};

// listado de productos
const products = (req, res) => {
    const productos = productsServices.obtenerTodos();
    const categorias = productsServices.obtenerCategorias ? productsServices.obtenerCategorias() : [];

    res.render("layouts/main", {
        body: "../pages/index",
        productos,
        categorias,
        pageCss: "index"
    });
};

// detalle de producto
const detail = (req, res) => {
    const producto = productsServices.obtenerPorId(req.params.id);

    if (!producto) {
        const sugeridos = productsServices.obtenerTodos().slice(0, 3);

        return res.status(404).render("layouts/main", {
            body: "../pages/error",
            status: 404,
            mensaje: "Producto no encontrado",
            sugeridos,
            pageCss: "error"
        });
    }

    const relacionados = productsServices.getRelacionados
        ? productsServices.getRelacionados(producto.categoria_id, producto.id)
        : productsServices.obtenerTodos().filter((p) => p.id !== producto.id).slice(0, 3);

    res.render("layouts/main", {
        body: "../pages/products",
        producto,
        relacionados,
        pageCss: "products"
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

// checkout
const checkout = (req, res) => {
    res.render("layouts/main", {
        body: "../pages/checkout",
        pageCss: "checkout"
    });
};

// login y register
const login = (req, res) => {
    res.render("layouts/main", {
        body: "../pages/login",
        pageCss: "auth"
    });
};

const register = (req, res) => {
    res.render("layouts/main", {
        body: "../pages/register",
        pageCss: "auth"
    });
};

const processRegister = (req, res) => {
    console.log(req.body);
    res.redirect("/login");
};

// error
const error = (req, res) => {
    const sugeridos = productsServices.obtenerTodos().slice(0, 2);

    res.status(404).render("layouts/main", {
        body: "../pages/error",
        mensaje: "Página no encontrada",
        sugeridos,
        pageCss: "error"
    });
};

const orderByPrice = (req, res) => {
    const orden = req.query.orden;
    const productos = productsServices.ordenarPorPrecio(orden);
    const categorias = productsServices.obtenerCategorias ? productsServices.obtenerCategorias() : [];

    res.render("layouts/main", {
        body: "../pages/index",
        productos,
        categorias,
        pageCss: "index"
    });
};

const getProductDetail = (req, res) => {
    const productId = req.params.id;
    const product = productService.getById(productId);

    if (!product) {
        return res.status(404).send("Producto no encontrado");
    }

    // Obtener todos los productos
    const todosLosProductos = productService.getAll();

    // 🔴 Filtrar: Misma categoría Y diferente ID
    const relacionados = todosLosProductos.filter(p => 
        p.category_id === product.category_id && p.id != productId
    );

    res.render("productDetail", {
        product,
        relacionados
    });
};

// API - Obtener todos los productos
// API - Obtener todos los productos (con soporte para filtro por categoría)
// API - Obtener todos los productos
const apiGetAll = (req, res) => {
    try {
        const rawCat = req.query.categoria_id ?? req.query.category_id;
        
        if (rawCat !== undefined && rawCat !== null && rawCat !== '') {
            // Convierte "1" o "1.0" a un número entero (1)
            const categoriaId = parseInt(rawCat, 10);
            
            const productos = productsServices.obtenerPorCategoria(categoriaId);
            return res.status(200).json(productos);
        }

        const todosLosProductos = productsServices.obtenerTodos();
        res.status(200).json(todosLosProductos);
    } catch (error) {
        console.error("Error exacto en apiGetAll:", error);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
};

// API - Obtener un producto por ID
const apiGetById = (req, res) => {
    const producto = productsServices.obtenerPorId(req.params.id);

    if (!producto) {
        return res.status(404).json({
            error: "Producto no encontrado"
        });
    }

    res.status(200).json(producto);
};

// API - Crear un producto
const apiCreate = (req, res) => {
    try {
        const rawCat = req.body.categoria_id ?? req.body.category_id ?? req.body.categoriaId ?? req.body.categoryId ?? req.body.categoria;
        const cleanCategoryId = rawCat !== undefined && rawCat !== null && rawCat !== "" ? parseInt(rawCat, 10) : null;

        const datosACrear = {
            ...req.body,
            categoria_id: cleanCategoryId,
            category_id: cleanCategoryId
        };

        const id = productsServices.crear(datosACrear);

        res.status(201).json({
            message: "Producto creado",
            id
        });
    } catch (error) {
        console.error("Error en apiCreate:", error);
        res.status(500).json({
            error: "Error interno al crear el producto: " + error.message
        });
    }
};

// API - Actualizar un producto
const apiUpdate = (req, res) => {
    try {
        const id = req.params.id;

        // 1. Verificar si el producto existe
        const productoExistente = productsServices.obtenerPorId(id);
        if (!productoExistente) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        // 2. Extraer el ID de categoría ingresado de cualquier propiedad posible
        const rawCat = req.body.categoria_id ?? req.body.category_id ?? req.body.categoriaId ?? req.body.categoryId ?? req.body.categoria;
        
        // Convertir a número entero puro (remueve decimales como "999.0" y cadenas de texto)
        const cleanCategoryId = rawCat !== undefined && rawCat !== null && rawCat !== "" ? parseInt(rawCat, 10) : null;

        // 3. Crear el objeto normalizado
        const datosAActualizar = {
            ...req.body,
            categoria_id: cleanCategoryId,
            category_id: cleanCategoryId // Se envía en ambas nomenclaturas por compatibilidad
        };

        // 4. Ejecutar la actualización en SQLite
        productsServices.actualizar(id, datosAActualizar);

        res.status(200).json({
            message: "Producto actualizado con éxito"
        });
    } catch (error) {
        console.error("Error en apiUpdate:", error);
        res.status(500).json({
            error: "Error interno al actualizar el producto: " + error.message
        });
    }
};

// API - Eliminar un producto
const apiDelete = (req, res) => {
    try {
        const id = req.params.id;
        const result = productsServices.eliminar(id);

        // result.changes indica cuántas filas fueron afectadas en SQLite
        if (!result || result.changes === 0) {
            return res.status(404).json({
                error: "Producto no encontrado o ya fue eliminado"
            });
        }

        res.status(200).json({
            message: "Producto eliminado con éxito"
        });
    } catch (error) {
        console.error("Error en apiDelete:", error);
        res.status(500).json({
            error: "Error interno al eliminar el producto: " + error.message
        });
    }
};

// API - Obtener todas las categorías
const apiGetCategories = (req, res) => {
    try {
        const categorias = productsServices.obtenerCategorias();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener categorías" });
    }
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
    apiGetAll,
    apiGetById,
    apiCreate,
    apiUpdate,
    apiDelete,
    apiGetCategories
};