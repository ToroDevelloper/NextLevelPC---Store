const express = require('express');
const router = express.Router();
const OrdenController = require('../controllers/OrdenesController.js');
const CitaServicioService = require('../services/CitaServicioService');

//RUTAS PARA VISTAS DE ÓRDENES (HTML)
router.get('/ordenes', OrdenController.mostrarListaVista);
router.get('/ordenes/create', OrdenController.mostrarCrearVista);
router.get('/ordenes/:id', OrdenController.mostrarDetalleVista);
router.get('/ordenes/edit/:id', OrdenController.mostrarEditarVista);

// DASHBOARD DE SERVICIOS (CITAS)
router.get('/dashboard-servicios', async (req, res) => {
  try {
    const citas = await CitaServicioService.getAllCitas();
    res.render('dashboard/citas', { citas: Array.isArray(citas) ? citas : [] });
  } catch (error) {
    console.error('Error cargando dashboard de servicios:', error.message);
    res.status(500).send('<h1>Error cargando dashboard de servicios</h1>');
  }
});


//RUTAS PARA FORMULARIOS HTML
router.post('/ordenes/crear', OrdenController.crearDesdeFormulario);
router.post('/ordenes/update/:id', OrdenController.actualizarDesdeFormulario);

module.exports = router;