const RolModel = require('../models/RolModel.js');

class RolesController {

    // GET /api/roles
    static async getRoles(req, res) {
        try {
            const roles = await RolModel.getAll();
            res.json(roles);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener roles', error });
        }
    }

    // GET /api/roles/:id
    static async getRolById(req, res) {
        try {
            const { id } = req.params;
            const rol = await RolModel.getById(id);
            if (!rol) {
                return res.status(404).json({ mensaje: 'Rol no encontrado' });
            }
            res.json(rol);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener el rol', error });
        }
    }

    // POST /api/roles
    static async createRol(req, res) {
        try {
            const nuevoRol = req.body;
            const insertId = await RolModel.create(nuevoRol);
            res.status(201).json({ mensaje: 'Rol creado exitosamente', id: insertId });
        } catch (error) {
            res.status(400).json({ mensaje: 'Error al crear el rol', error });
        }
    }

    // PUT /api/roles/:id
    static async updateRol(req, res) {
        try {
            const { id } = req.params;
            const rolData = req.body;
            const updated = await RolModel.update(id, rolData);

            if (updated === 0) {
                return res.status(404).json({ mensaje: 'Rol no encontrado' });
            }

            res.json({ mensaje: 'Rol actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al actualizar el rol', error });
        }
    }

    // DELETE /api/roles/:id
    static async deleteRol(req, res) {
        try {
            const { id } = req.params;
            const deleted = await RolModel.delete(id);

            if (deleted === 0) {
                return res.status(404).json({ mensaje: 'Rol no encontrado' });
            }

            res.json({ mensaje: 'Rol eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al eliminar el rol', error });
        }
    }
}

module.exports = RolesController;
