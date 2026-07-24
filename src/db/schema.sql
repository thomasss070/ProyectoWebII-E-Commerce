CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    precio REAL NOT NULL,
    imagen TEXT,
    descripcion TEXT,
    categoria TEXT,
    flag TEXT,
    stock INTEGER DEFAULT 0,
    especificaciones TEXT
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY
);

