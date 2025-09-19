const express = require('express')
const db = require('../config/db.js')
const UsuariosController = require('../controllers/UsuariosController.js')

const router = express.Router();

router.get('/',UsuariosController.obtenerTodos);
router.post('/',UsuariosController.crear);

module.exports = router;

