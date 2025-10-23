// routes/categorias.js
const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const verificarToken = require('../middlewares/authMiddleware')
const verificarRol = require('../middlewares/roleMiddleware')

// GET /api/categorias - Obtener todas las categorías
router.get('/', categoriaController.getCategorias);

router.get('/producto', categoriaController.getCategoriasProductos);

// GET /api/categorias/:id - Obtener una categoría por ID
router.get('/:id', categoriaController.getCategoria);

// POST /api/categorias - Crear una nueva categoría
router.post('/',verificarToken,verificarRol([1]), categoriaController.createCategoria);

// PUT /api/categorias/:id - Actualizar una categoría
router.patch('/:id',verificarToken,verificarRol([1]), categoriaController.updateCategoria);

// DELETE /api/categorias/:id - Eliminar una categoría
router.delete('/:id',verificarToken,verificarRol([1]), categoriaController.deleteCategoria);

module.exports = router;