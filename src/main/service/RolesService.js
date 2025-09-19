const RolModel = require('../models/RolModel.js');

class RolesService {

    static async getAllRoles() {
        return await RolModel.getAll();
    }

    static async getRolById(id) {
        return await RolModel.getById(id);
    }

    static async createRol(rol) {
        if (!rol.nombre) {
            throw new Error('El nombre del rol es obligatorio');
        }
        return await RolModel.create(rol);
    }

    static async updateRol(id, rol) {
        return await RolModel.update(id, rol);
    }

    static async deleteRol(id) {
        return await RolModel.delete(id);
    }
}

module.exports = RolesService;

