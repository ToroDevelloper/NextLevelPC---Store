// routes/categorias.js
const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// GET /api/categorias - Obtener todas las categorías
router.get('/', categoriaController.getCategorias);

// GET /api/categorias/:id - Obtener una categoría por ID
router.get('/:id', categoriaController.getCategoria);

// POST /api/categorias - Crear una nueva categoría
router.post('/', categoriaController.createCategoria);

// PUT /api/categorias/:id - Actualizar una categoría
router.put('/:id', categoriaController.updateCategoria);

// DELETE /api/categorias/:id - Eliminar una categoría
router.delete('/:id', categoriaController.deleteCategoria);

module.exports = router;