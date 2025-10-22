const express = require('express');
const router = express.Router();
const OrdenController = require('../controllers/OrdenesController.js');

//RUTAS PARA VISTAS DE ÓRDENES (HTML)
router.get('/ordenes', OrdenController.mostrarListaVista);
router.get('/ordenes/create', OrdenController.mostrarCrearVista);
router.get('/ordenes/:id', OrdenController.mostrarDetalleVista);
router.get('/ordenes/edit/:id', OrdenController.mostrarEditarVista);

//RUTAS PARA FORMULARIOS HTML
router.post('/ordenes/crear', OrdenController.crearDesdeFormulario);
router.post('/ordenes/update/:id', OrdenController.actualizarDesdeFormulario);

module.exports = router;