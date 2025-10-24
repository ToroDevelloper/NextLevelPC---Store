const express = require('express');
const UsuariosController = require('../controllers/UsuariosController.js');
const verificarToken = require('../middlewares/authMiddleware.js');
const verificarRol = require('../middlewares/roleMiddleware.js');

const router = express.Router();

router.get('/',verificarToken,verificarRol([1]),UsuariosController.obtenerTodos);
router.post('/', UsuariosController.crear);
router.post('/registro', UsuariosController.crear); 
router.delete('/:id',verificarToken,verificarRol([1]),UsuariosController.eliminar);
router.patch('/:id',verificarToken ,UsuariosController.actualizar);
router.get('/:id',verificarToken ,UsuariosController.obtenerPorId);
router.post('/login', UsuariosController.login);

module.exports = router;
