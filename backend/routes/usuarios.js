const express = require('express');
const UsuariosController = require('../controllers/UsuariosController.js');
const viewAuth = require('../middlewares/viewAuth.js');

const router = express.Router();

// Rutas públicas
router.post('/', UsuariosController.crear);
router.post('/registro', UsuariosController.crear); 
router.post('/login', UsuariosController.login);
router.post('/refresh', UsuariosController.refresh);
router.post('/logout', UsuariosController.logout);

// Rutas protegidas - Usuario puede ver/editar su propio perfil
router.get('/:id', viewAuth(['admin', 'empleado', 'cliente']), UsuariosController.obtenerPorId);
router.patch('/:id', viewAuth(['admin', 'empleado', 'cliente']), UsuariosController.actualizar);

// Rutas solo admin
router.get('/', viewAuth(['admin']), UsuariosController.obtenerTodos);
router.delete('/:id', viewAuth(['admin']), UsuariosController.eliminar);

module.exports = router;
