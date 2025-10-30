const express = require('express');
const router = express.Router();
const ProductosController = require('../controllers/ProductosController');
const verificarToken = require('../middlewares/authMiddleware.js');
const verificarRol = require('../middlewares/roleMiddleware.js');


router.get('/', ProductosController.obtenerTodosLosProductos);


router.get('/destacados', ProductosController.obtenerProductosDestacados);

router.get('/con-imagenes', ProductosController.obtenerProductosConImagenes);

router.get('/activos', ProductosController.obtenerProductosActivos);


router.get('/:id', ProductosController.obtenerProductoPorId);


router.get('/categoria/:categoria_id', ProductosController.obtenerProductosPorCategoria);


router.post('/',verificarToken,verificarRol([1]),ProductosController.crearProducto);


router.patch('/:id',verificarToken,verificarRol([1]), ProductosController.actualizarProducto);


router.delete('/:id', verificarToken,verificarRol([1]),ProductosController.eliminarProducto);

module.exports = router;
