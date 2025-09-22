const express = require('express');
const router = express.Router();
const RolController = require('../controllers/rolController');

// Middleware de validación básica (puedes expandirlo)
const validarRol = (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        const { Nombre } = req.body;
        if (!Nombre || Nombre.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El nombre del rol es requerido'
            });
        }
    }
    next();
};

// GET /api/roles - Obtener todos los roles
router.get('/', RolController.obtenerTodos);

// GET /api/roles/:id - Obtener un rol por ID
router.get('/:id', RolController.obtenerPorId);

// POST /api/roles - Crear un nuevo rol
router.post('/', validarRol, RolController.crear);

// PUT /api/roles/:id - Actualizar un rol
router.put('/:id', validarRol, RolController.actualizar);

// DELETE /api/roles/:id - Eliminar un rol
router.delete('/:id', RolController.eliminar);

// GET /api/roles/:id/usuarios - Obtener usuarios por rol
router.get('/:id/usuarios', RolController.obtenerUsuarios);

module.exports = router;