const express = require('express');
const router = express.Router();
const ImagenProductoController = require('../controllers/ImagenProductoController');

router.post('/', ImagenProductoController.crear);
router.get('/producto/:producto_id', ImagenProductoController.obtenerPorProducto);
router.get('/principal/:producto_id', ImagenProductoController.obtenerPrincipal);
router.delete('/:id', ImagenProductoController.eliminar);
router.put('/establecer-principal', ImagenProductoController.establecerPrincipal);

module.exports = router;