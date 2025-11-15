const express = require('express');
const router = express.Router();
const ImagenProductoController = require('../controllers/ImagenProductoController');
const { verificarRol } = require('../middlewares/authMiddleware');

router.post('/', verificarRol(['admin', 'empleado']), ImagenProductoController.crear);
router.get('/producto/:producto_id', ImagenProductoController.obtenerPorProducto);
router.get('/principal/:producto_id', ImagenProductoController.obtenerPrincipal);
router.delete('/:id', verificarRol(['admin']), ImagenProductoController.eliminar);
router.patch('/establecer-principal', verificarRol(['admin', 'empleado']), ImagenProductoController.establecerPrincipal);

module.exports = router;