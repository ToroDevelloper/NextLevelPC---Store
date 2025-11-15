const express = require('express');
const OrdenesController = require('../controllers/OrdenesController.js');
const viewAuth = require('../middlewares/viewAuth.js');

const router = express.Router();

router.get('/', viewAuth(['admin', 'empleado']), OrdenesController.obtenerTodos);
router.post('/', viewAuth(['admin', 'empleado', 'cliente']), OrdenesController.crear);
router.delete('/:id', viewAuth(['admin']), OrdenesController.eliminar);
router.patch('/:id', viewAuth(['admin', 'empleado']), OrdenesController.actualizar);
router.get('/:id', viewAuth(['admin', 'empleado', 'cliente']), OrdenesController.obtenerPorId);
router.get('/cliente/:clienteId', viewAuth(['admin', 'empleado', 'cliente']), OrdenesController.obtenerPorCliente);

module.exports = router;