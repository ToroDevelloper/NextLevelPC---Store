const express = require('express');
const router = express.Router();
const ProductosController = require('../controllers/ProductosController');

// GET - Obtener todos los productos
router.get('/', ProductosController.obtenerTodosLosProductos);

// GET - Obtener productos activos
router.get('/activos', ProductosController.obtenerProductosActivos);

// GET - Obtener producto por ID
router.get('/:id', ProductosController.obtenerProductoPorId);

// GET - Obtener productos por categoría
router.get('/categoria/:categoria_id', ProductosController.obtenerProductosPorCategoria);

// POST - Crear nuevo producto
router.post('/', ProductosController.crearProducto);

// PUT - Actualizar producto completo
router.put('/:id', ProductosController.actualizarProducto);

// PATCH - Actualizar stock específico
router.patch('/:id/stock', ProductosController.actualizarStock);

// PATCH - Desactivar producto
router.patch('/:id/desactivar', ProductosController.desactivarProducto);

// PATCH - Activar producto
router.patch('/:id/activar', ProductosController.activarProducto);

// DELETE - Eliminar producto permanentemente
router.delete('/:id', ProductosController.eliminarProducto);

module.exports = router;