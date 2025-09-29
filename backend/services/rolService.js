const Roles = require('../models/Roles');

class RolService {
    static async obtenerTodosLosRoles() {
        try {
            return await Roles.obtenerTodos();
        } catch (error) {
            throw new Error('Error al obtener los roles: ' + error.message);
        }
    }

    static async obtenerRolPorId(id) {
        try {
            const rol = await Roles.obtenerPorId(id);
            if (!rol) {
                throw new Error('Rol no encontrado');
            }
            return rol;
        } catch (error) {
            throw new Error('Error al obtener el rol: ' + error.message);
        }
    }

    static async crearRol(datosRol) {
        try {
            // Validar campos requeridos
            if (!datosRol.Nombre) {
                throw new Error('El nombre del rol es requerido');
            }

            // Verificar si el nombre ya existe
            const rolExistente = await Roles.obtenerPorNombre(datosRol.Nombre);
            if (rolExistente) {
                throw new Error('Ya existe un rol con ese nombre');
            }

            return await Roles.crear(datosRol);
        } catch (error) {
            throw new Error('Error al crear el rol: ' + error.message);
        }
    }

    static async actualizarRol(id, datosActualizados) {
        try {
            // Verificar si el rol existe
            const rolExistente = await Roles.obtenerPorId(id);
            if (!rolExistente) {
                throw new Error('Rol no encontrado');
            }

            // Si se está actualizando el nombre, verificar que no esté en uso
            if (datosActualizados.Nombre && datosActualizados.Nombre !== rolExistente.Nombre) {
                const nombreEnUso = await Roles.nombreEnUsoPorOtroRol(datosActualizados.Nombre, id);
                if (nombreEnUso) {
                    throw new Error('Ya existe otro rol con ese nombre');
                }
            }

            const actualizado = await Roles.actualizar(id, datosActualizados);
            if (!actualizado) {
                throw new Error('No se pudo actualizar el rol');
            }

            return await Roles.obtenerPorId(id);
        } catch (error) {
            throw new Error('Error al actualizar el rol: ' + error.message);
        }
    }

    static async eliminarRol(id) {
        try {
            // Verificar si el rol existe
            const rolExistente = await Roles.obtenerPorId(id);
            if (!rolExistente) {
                throw new Error('Rol no encontrado');
            }

            // Verificar si el rol tiene usuarios asociados
            const tieneUsuarios = await Roles.tieneUsuariosAsociados(id);
            if (tieneUsuarios) {
                throw new Error('No se puede eliminar el rol porque tiene usuarios asociados');
            }

            const eliminado = await Roles.eliminar(id);
            if (!eliminado) {
                throw new Error('No se pudo eliminar el rol');
            }

            return { message: 'Rol eliminado correctamente' };
        } catch (error) {
            throw new Error('Error al eliminar el rol: ' + error.message);
        }
    }

    static async obtenerUsuariosPorRol(idRol) {
        try {
            const rol = await Roles.obtenerPorId(idRol);
            if (!rol) {
                throw new Error('Rol no encontrado');
            }

            return await Roles.obtenerUsuariosPorRol(idRol);
        } catch (error) {
            throw new Error('Error al obtener usuarios del rol: ' + error.message);
        }
    }
}

module.exports = RolService;

