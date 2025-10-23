const express = require('express');
const OrdenesController = require('../controllers/OrdenesController.js');

const router = express.Router();

router.get('/', OrdenesController.obtenerTodos);
router.post('/', OrdenesController.crear);
router.delete('/:id', OrdenesController.eliminar);
router.patch('/:id', OrdenesController.actualizar);
router.get('/:id', OrdenesController.obtenerPorId);
router.get('/cliente/:clienteId', OrdenesController.obtenerPorCliente);

module.exports = router;