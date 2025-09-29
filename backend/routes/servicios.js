const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/ServicioController');

// Middleware de validación
const validateServicio = (req, res, next) => {
    const { tipo, precio } = req.body;

    if (!tipo || tipo.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'El tipo de servicio es requerido'
        });
    }

    if (precio && precio < 0) {
        return res.status(400).json({
            success: false,
            message: 'El precio no puede ser negativo'
        });
    }

    next();
};

// GET /api/servicios - Obtener todos los servicios
router.get('/', servicioController.obtenerTodosServicios);

// GET /api/servicios/:id - Obtener un servicio por ID
router.get('/:id', servicioController.obtenerServicio);

// POST /api/servicios - Crear un nuevo servicio
router.post('/', validateServicio, servicioController.crearServicio);

// PUT /api/servicios/:id - Actualizar un servicio
router.put('/:id', validateServicio, servicioController.actualizarServicio);

// DELETE /api/servicios/:id - Eliminar un servicio
router.delete('/:id', servicioController.eliminarServicio);

module.exports = router;