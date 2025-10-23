const express = require('express');
const router = express.Router();
const ImagenProductoController = require('../controllers/ImagenProductoController');
const verificarToken = require('../middlewares/authMiddleware')
const verificarRol = require('../middlewares/roleMiddleware')

router.post('/',verificarToken,verificarRol([1]), ImagenProductoController.crear);
router.get('/producto/:producto_id', ImagenProductoController.obtenerPorProducto);
router.get('/principal/:producto_id', ImagenProductoController.obtenerPrincipal);
router.delete('/:id',verificarToken,verificarRol([1]), ImagenProductoController.eliminar);
router.patch('/establecer-principal',verificarToken,verificarRol([1]), ImagenProductoController.establecerPrincipal);

module.exports = router;