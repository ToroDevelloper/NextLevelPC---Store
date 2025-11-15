const express = require('express');
const UsuariosController = require('../controllers/UsuariosController.js');
const { verificarRol } = require('../middlewares/authMiddleware.js');

const router = express.Router();

// Rutas públicas
router.post('/', UsuariosController.crear);
router.post('/registro', UsuariosController.crear); 
router.post('/login', UsuariosController.login);
router.post('/refresh', UsuariosController.refresh);
router.post('/logout', UsuariosController.logout);

// Rutas protegidas
router.get('/', verificarRol(['admin']), UsuariosController.obtenerTodos);
router.delete('/:id', verificarRol(['admin']), UsuariosController.eliminar);
router.patch('/:id', verificarRol(['admin', 'empleado']), UsuariosController.actualizar);
router.get('/:id', verificarRol(['admin', 'empleado']), UsuariosController.obtenerPorId);

module.exports = router;
