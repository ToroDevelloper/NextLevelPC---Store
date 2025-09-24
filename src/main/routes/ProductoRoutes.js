const express = require('express')
const ProductosController = require('../controllers/ProductosController.js')

const router = express.Router();

router.get('/', ProductosController.obtenerTodos);
router.post('/', ProductosController.crear);
router.delete('/:id', ProductosController.eliminar);
router.put('/:id', ProductosController.actualizar);
router.get('/:id', ProductosController.obtenerPorId);

module.exports = router;