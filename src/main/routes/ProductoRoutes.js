const express = require('express');
const router = express.Router();
const ProductoController = require('../controllers/productoController');

// Middleware de validación
const validarProducto = (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        const { Nombre, Categoria_ID, Precio_Actual } = req.body;

        if (!Nombre || Nombre.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El nombre del producto es requerido'
            });
        }

        if (!Categoria_ID) {
            return res.status(400).json({
                success: false,
                message: 'La categoría es requerida'
            });
        }

        if (Precio_Actual === undefined || Precio_Actual < 0) {
            return res.status(400).json({
                success: false,
                message: 'El precio actual es requerido y debe ser mayor o igual a 0'
            });
        }
    }
    next();
};

// GET /api/productos - Obtener todos los productos
router.get('/', ProductoController.obtenerTodos);

// GET /api/productos/buscar - Buscar productos
router.get('/buscar', ProductoController.buscar);

// GET /api/productos/categoria/:categoriaId - Obtener productos por categoría
router.get('/categoria/:categoriaId', ProductoController.obtenerPorCategoria);

// GET /api/productos/:id - Obtener un producto por ID
router.get('/:id', ProductoController.obtenerPorId);

// POST /api/productos - Crear un nuevo producto
router.post('/', validarProducto, ProductoController.crear);

// PUT /api/productos/:id - Actualizar un producto
router.put('/:id', validarProducto, ProductoController.actualizar);

// DELETE /api/productos/:id - Eliminar un producto
router.delete('/:id', ProductoController.eliminar);

// PATCH /api/productos/:id/desactivar - Desactivar producto
router.patch('/:id/desactivar', ProductoController.desactivar);

// PATCH /api/productos/:id/activar - Activar producto
router.patch('/:id/activar', ProductoController.activar);

module.exports = router;