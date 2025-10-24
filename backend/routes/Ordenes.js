const express = require('express');
const OrdenesController = require('../controllers/OrdenesController.js');
const verificarToken = require('../middlewares/authMiddleware.js')
const verificarRol = require('../middlewares/roleMiddleware.js')


const router = express.Router();

router.get('/',verificarToken,verificarRol([1]), OrdenesController.obtenerTodos);
router.post('/',verificarToken, OrdenesController.crear);
router.delete('/:id',verificarToken, OrdenesController.eliminar);
router.patch('/:id',verificarToken, OrdenesController.actualizar);
router.get('/:id',verificarToken, OrdenesController.obtenerPorId);
router.get('/cliente/:clienteId',verificarToken, OrdenesController.obtenerPorCliente);

module.exports = router;