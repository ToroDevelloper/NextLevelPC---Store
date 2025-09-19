const express = require('express');
const router = express.Router();
const RolesController = require('../controllers/RolesController.js');

// Rutas de roles
router.get('/roles', RolesController.getRoles);
router.get('/roles/:id', RolesController.getRolById);
router.post('/roles', RolesController.createRol);
router.put('/roles/:id', RolesController.updateRol);
router.delete('/roles/:id', RolesController.deleteRol);

module.exports = router;
