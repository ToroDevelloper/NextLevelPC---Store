const RolesService = require('../service/RolesService');

// GET /api/roles
exports.getRoles = (req, res) => {
    RolesService.getAllRoles((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// GET /api/roles/:id
exports.getRolById = (req, res) => {
    const { id } = req.params;
    RolesService.getRolById(id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: 'Rol no encontrado' });
        res.json(result[0]);
    });
};

// POST /api/roles
exports.createRol = (req, res) => {
    const nuevoRol = req.body;
    RolesService.createRol(nuevoRol, (err, result) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Rol creado', id: result.insertId });
    });
};

// PUT /api/roles/:id
exports.updateRol = (req, res) => {
    const { id } = req.params;
    const rolData = req.body;
    RolesService.updateRol(id, rolData, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Rol actualizado' });
    });
};

// DELETE /api/roles/:id
exports.deleteRol = (req, res) => {
    const { id } = req.params;
    RolesService.deleteRol(id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Rol eliminado' });
    });
};
