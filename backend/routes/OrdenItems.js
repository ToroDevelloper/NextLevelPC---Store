const express = require('express');
const OrdenItemsController = require('../controllers/OrdenItemsController.js');
const { verificarRol } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get('/', verificarRol(['admin', 'empleado']), OrdenItemsController.obtenerTodos);
router.post('/', verificarRol(['admin', 'empleado', 'cliente']), OrdenItemsController.crear);
router.put('/:id', verificarRol(['admin', 'empleado']), OrdenItemsController.actualizar);
router.delete('/:id', verificarRol(['admin']), OrdenItemsController.eliminar);
router.get('/orden/:ordenId', verificarRol(['admin', 'empleado', 'cliente']), OrdenItemsController.obtenerPorOrden);

module.exports = router;