const pool = require('../config/db');


const poblarCategorias = async (req, res) => {
    try {
        const apiFetch = await fetch('https://fakestoreapi.com/products/categories');
        const categories = await apiFetch.json();

        for (const catName of categories) {
            await pool.query(
                'INSERT INTO categoria (nombre) VALUES ($1) ON CONFLICT (nombre) DO NOTHING',
                [catName]
            );
        }
        res.status(200).json({ mensaje: "Las 4 categorías han sido pobladas" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const poblarProductos = async (req, res) => {
    try {
        const apiFetch = await fetch('https://fakestoreapi.com/products');
        const products = await apiFetch.json();

        for (const product of products) {
            const { title, price, description, image, category } = product;
            const stock = Math.floor(Math.random() * 50) + 1;

            const resCat = await pool.query('SELECT id FROM categoria WHERE nombre = $1', [category]);
            const categoriaId = resCat.rows[0]?.id;

            await pool.query(
                `INSERT INTO productos (nombre, precio, stock, description, imagen_url, id_categoria)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [title, price, stock, description, image, categoriaId]
            );
        }
        res.status(200).json({ mensaje: "20 productos poblados con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const buscarProductos = async (req, res) => {
    try {
        const { letra } = req.params;
        const result = await pool.query(
            "SELECT * FROM productos WHERE nombre ILIKE $1", 
            [`%${letra}%`]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const buscarCategorias = async (req, res) => {
    try {
        const { letra } = req.params;
        const result = await pool.query(
            "SELECT * FROM categoria WHERE nombre ILIKE $1", 
            [`%${letra}%`]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerProductos = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM productos ORDER BY id ASC");
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear producto manual
const crearProducto = async (req, res) => {
    try {
        const { nombre, precio, stock, descripcion, imagen_url, id_categoria, youtube_id } = req.body;

        if (!nombre || !precio || !id_categoria || !youtube_id) {
            return res.status(400).json({ mensaje: "Nombre, precio, id_categoria y youtube_id son obligatorios" });
        }

        const result = await pool.query(
            `INSERT INTO productos (nombre, precio, stock, descripcion, imagen_url, id_categoria, youtube_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, 
            [
                nombre, 
                precio, 
                stock || 1, 
                descripcion || '', 
                imagen_url || '', 
                id_categoria, 
                youtube_id 
            ]
        );

        res.status(201).json({
            mensaje: "Producto guardado con éxito",
            producto: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
    poblarProductos, 
    poblarCategorias, 
    buscarProductos, 
    buscarCategorias,
    obtenerProductos,
    crearProducto 
};