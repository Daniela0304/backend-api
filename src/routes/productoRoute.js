const express = require('express');
const router = express.Router();
const { 
    poblarProductos, 
    poblarCategorias, 
    buscarProductos, 
    buscarCategorias,
    obtenerProductos 
} = require('../controllers/externalController');

// Estas rutas se completan con el prefijo /api/productos definido en index.js

// GET /api/productos/todos
router.get('/todos', obtenerProductos); 

// Rutas de poblado
router.get('/poblar-categorias', poblarCategorias);
router.post('/poblar', poblarProductos);

// Rutas de búsqueda
router.get('/buscar/productos/:letra', buscarProductos);
router.get('/buscar/categorias/:letra', buscarCategorias);

module.exports = router;