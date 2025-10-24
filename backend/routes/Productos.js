const express = require('express');
const router = express.Router();
const ProductosController = require('../controllers/ProductosController');
const verificarToken = require('../middlewares/authMiddleware.js');
const verificarRol = require('../middlewares/roleMiddleware.js');

// GET - Obtener todos los productos
router.get('/', ProductosController.obtenerTodosLosProductos);

// Agregar esta ruta ANTES de las rutas con parámetros en backend/routes/Productos.js
// La ruta debe ir después de la línea: router.get('/con-imagenes', ProductosController.obtenerProductosConImagenes);

router.get('/destacados', ProductosController.obtenerProductosDestacados);

router.get('/con-imagenes', ProductosController.obtenerProductosConImagenes);
// GET - Obtener productos activos
router.get('/activos', ProductosController.obtenerProductosActivos);

// GET - Obtener producto por ID
router.get('/:id', ProductosController.obtenerProductoPorId);

// GET - Obtener productos por categoría
router.get('/categoria/:categoria_id', ProductosController.obtenerProductosPorCategoria);

// POST - Crear nuevo producto
router.post('/',verificarToken,verificarRol([1]),ProductosController.crearProducto);

// PATCH - Actualizar producto completo
router.patch('/:id',verificarToken,verificarRol([1]), ProductosController.actualizarProducto);

// DELETE - Eliminar producto permanentemente
router.delete('/:id', verificarToken,verificarRol([1]),ProductosController.eliminarProducto);

module.exports = router;
