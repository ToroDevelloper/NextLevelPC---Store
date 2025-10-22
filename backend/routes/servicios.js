// routes/servicios.js
const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');

// GET /api/servicios/tipo/:tipo - Debe ir ANTES de /:id para evitar conflictos
router.get('/tipo/:tipo', servicioController.getServiciosByTipo);

// GET /api/servicios - Obtener todos los servicios
router.get('/', servicioController.getAllServicios);

// GET /api/servicios/:id - Obtener servicio por ID
router.get('/:id', servicioController.getServicioById);

// POST /api/servicios - Crear nuevo servicio
router.post('/', servicioController.createServicio);

// PUT /api/servicios/:id - Actualizar servicio
router.put('/:id', servicioController.updateServicio);

// DELETE /api/servicios/:id - Eliminar servicio
router.delete('/:id', servicioController.deleteServicio);

module.exports = router;