const express = require('express')
const db = require('../config/db.js')
const UsuariosController = require('../controllers/UsuariosController.js')

const router = express.Router();

router.get('/',UsuariosController.obtenerTodos);
router.post('/',UsuariosController.crear);
router.delete('/:id',UsuariosController.eliminar);
router.put('/:id',UsuariosController.actualizar);
router.get('/:id',UsuariosController.obtenerPorId);

module.exports = router;

