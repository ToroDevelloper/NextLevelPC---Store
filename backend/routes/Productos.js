const express = require('express');
const router = express.Router();
const ProductosController = require('../controllers/ProductosController.js');
const { verificarRol } = require('../middlewares/authMiddleware.js'); // Importar el nuevo middleware


// Rutas públicas
router.get('/', ProductosController.obtenerTodosLosProductos);
router.get('/destacados', ProductosController.obtenerProductosDestacados);
router.get('/con-imagenes', ProductosController.obtenerProductosConImagenes);
router.get('/activos', ProductosController.obtenerProductosActivos);
router.get('/buscar', ProductosController.buscarProductos);
router.get('/categoria/:categoria_id', ProductosController.obtenerProductosPorCategoria);
router.get('/:id', ProductosController.obtenerProductoPorId);

// Rutas protegidas
router.post('/', verificarRol(['admin', 'empleado']), ProductosController.crearProducto);
router.patch('/:id', verificarRol(['admin', 'empleado']), ProductosController.actualizarProducto);
router.delete('/:id', verificarRol(['admin']), ProductosController.eliminarProducto);

module.exports = router;
