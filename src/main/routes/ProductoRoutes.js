// routes/productos.js
const express = require('express');
const router = express.Router();
const ProductosController = require('../controllers/ProductosController');

// Rutas CRUD
router.get('/', ProductosController.getProductos);          // Obtener todos
router.get('/:id', ProductosController.getProductoById);    // Obtener por ID
router.post('/', ProductosController.createProducto);       // Crear
router.put('/:id', ProductosController.updateProducto);     // Actualizar
router.delete('/:id', ProductosController.deleteProducto);  // Eliminar

module.exports = router;
