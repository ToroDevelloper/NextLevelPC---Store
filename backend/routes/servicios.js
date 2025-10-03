// routes/servicios.js
const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');

/**
 * Middleware de validación para crear/actualizar servicios
 */
const validateServicio = (req, res, next) => {
    const { nombre, categoria_id, precio } = req.body;

    // Validar nombre
    if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
        return res.status(400).json({
            success: false,
            message: 'El nombre del servicio debe ser una cadena de texto válida'
        });
    }

    // Validar categoria_id
    if (categoria_id !== undefined && (isNaN(categoria_id) || parseInt(categoria_id) <= 0)) {
        return res.status(400).json({
            success: false,
            message: 'La categoría debe ser un número válido mayor a 0'
        });
    }

    // Validar precio
    if (precio !== undefined && (isNaN(precio) || parseFloat(precio) < 0)) {
        return res.status(400).json({
            success: false,
            message: 'El precio debe ser un número válido y no puede ser negativo'
        });
    }

    next();
};

/**
 * Middleware de validación para parámetros de ID
 */
const validateId = (req, res, next) => {
    const { id } = req.params;

    if (isNaN(id) || parseInt(id) <= 0) {
        return res.status(400).json({
            success: false,
            message: 'El ID debe ser un número válido mayor a 0'
        });
    }

    next();
};

// ============================================
// RUTAS
// ============================================

/**
 * GET /api/servicios
 * Obtener todos los servicios (con filtros opcionales)
 * Query params: nombre, categoria_id, minPrecio, maxPrecio
 */
router.get('/', servicioController.obtenerTodosServicios);

/**
 * GET /api/servicios/:id
 * Obtener un servicio por ID
 */
router.get('/:id', validateId, servicioController.obtenerServicio);

/**
 * POST /api/servicios
 * Crear un nuevo servicio
 * Body: { nombre, categoria_id, precio }
 */
router.post('/', validateServicio, servicioController.crearServicio);

/**
 * PUT /api/servicios/:id
 * Actualizar un servicio existente
 * Body: { nombre?, categoria_id?, precio? }
 */
router.put('/:id', validateId, validateServicio, servicioController.actualizarServicio);

/**
 * DELETE /api/servicios/:id
 * Eliminar un servicio
 */
router.delete('/:id', validateId, servicioController.eliminarServicio);

module.exports = router;