const express = require('express');
const OrdenesController = require('../controllers/OrdenesController.js');
const { verificarRol } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get('/', verificarRol(['admin', 'empleado']), OrdenesController.obtenerTodos);
router.post('/', verificarRol(['admin', 'empleado', 'cliente']), OrdenesController.crear);
router.delete('/:id', verificarRol(['admin']), OrdenesController.eliminar);
router.patch('/:id', verificarRol(['admin', 'empleado']), OrdenesController.actualizar);
router.get('/:id', verificarRol(['admin', 'empleado', 'cliente']), OrdenesController.obtenerPorId);
router.get('/cliente/:clienteId', verificarRol(['admin', 'empleado', 'cliente']), OrdenesController.obtenerPorCliente);

module.exports = router;