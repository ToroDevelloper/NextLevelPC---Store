const express = require('express');
const router = express.Router();
const citaServicioController = require('../controllers/CitaServicioController');

router.post('/', citaServicioController.create);

module.exports = router;

