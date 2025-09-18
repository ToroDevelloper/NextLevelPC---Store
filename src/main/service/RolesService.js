const RolModel = require('../models/RolModel');

const RolesService = {
    getAllRoles: (callback) => {
        RolModel.getAll(callback);
    },

    getRolById: (id, callback) => {
        RolModel.getById(id, callback);
    },

    createRol: (rol, callback) => {
        // Podrías meter validaciones aquí antes de llamar al modelo
        if (!rol.nombre) {
            return callback(new Error('El nombre del rol es obligatorio'));
        }
        RolModel.create(rol, callback);
    },

    updateRol: (id, rol, callback) => {
        RolModel.update(id, rol, callback);
    },

    deleteRol: (id, callback) => {
        RolModel.delete(id, callback);
    }
};

module.exports = RolesService;
