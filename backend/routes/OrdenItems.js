const express = require('express');
const OrdenItemsController = require('../controllers/OrdenItemsController.js');

const router = express.Router();

router.get('/', OrdenItemsController.obtenerTodos);  
router.post('/', OrdenItemsController.crear);
router.put('/:id', OrdenItemsController.actualizar);
router.delete('/:id', OrdenItemsController.eliminar);
router.get('/orden/:ordenId', OrdenItemsController.obtenerPorOrden);

module.exports = router;