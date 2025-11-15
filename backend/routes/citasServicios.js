const express = require('express');
const router = express.Router();
const citaServicioController = require('../controllers/CitaServicioController');
const { verificarRol } = require('../middlewares/authMiddleware');

// Cualquier cliente puede crear una cita
router.post('/', citaServicioController.create);

// Solo admin y empleado pueden ver las citas
router.get('/', verificarRol(['admin', 'empleado']), citaServicioController.getAll);
router.put('/:id/estado', verificarRol(['admin', 'empleado']), citaServicioController.updateStatus);

module.exports = router;
