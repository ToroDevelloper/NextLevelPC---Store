const Usuarios = require('../models/Usuarios');

class UsuariosService {
    static async obtenerTodos() {
        try {
            return await Usuarios.obtenerTodos();
        } catch (error) {
            throw new Error('Error al obtener usuarios: ' + error.message);
        }
    }

    static async obtenerPorId(id) {
        try {
            const usuario = await Usuarios.obtenerPorId(id);
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }
            return usuario;
        } catch (error) {
            throw new Error('Error al obtener el usuario: ' + error.message);
        }
    }

    static async crear(datosUsuario) {
        try {
            // Validar campos requeridos
            if (!datosUsuario.Nombre || !datosUsuario.Correo || !datosUsuario.Password) {
                throw new Error('Nombre, correo y contraseña son requeridos');
            }

            // Verificar si el correo ya existe
            const usuarioExistente = await Usuarios.obtenerPorCorreo(datosUsuario.Correo);
            if (usuarioExistente) {
                throw new Error('Ya existe un usuario con ese correo');
            }

            return await Usuarios.crear(datosUsuario);
        } catch (error) {
            throw new Error('Error al crear el usuario: ' + error.message);
        }
    }

    static async actualizar(id, datosActualizados) {
        try {
            // Verificar si el usuario existe
            const usuarioExistente = await Usuarios.obtenerPorId(id);
            if (!usuarioExistente) {
                throw new Error('Usuario no encontrado');
            }

            // Si se está actualizando el correo, verificar que no esté en uso
            if (datosActualizados.Correo && datosActualizados.Correo !== usuarioExistente.Correo) {
                const correoEnUso = await Usuarios.correoEnUsoPorOtroUsuario(datosActualizados.Correo, id);
                if (correoEnUso) {
                    throw new Error('Ya existe otro usuario con ese correo');
                }
            }

            const actualizado = await Usuarios.actualizar(id, datosActualizados);
            if (!actualizado) {
                throw new Error('No se pudo actualizar el usuario');
            }

            return await Usuarios.obtenerPorId(id);
        } catch (error) {
            throw new Error('Error al actualizar el usuario: ' + error.message);
        }
    }

    static async eliminar(id) {
        try {
            // Verificar si el usuario existe
            const usuarioExistente = await Usuarios.obtenerPorId(id);
            if (!usuarioExistente) {
                throw new Error('Usuario no encontrado');
            }

            const eliminado = await Usuarios.eliminar(id);
            if (!eliminado) {
                throw new Error('No se pudo eliminar el usuario');
            }

            return { message: 'Usuario eliminado correctamente' };
        } catch (error) {
            throw new Error('Error al eliminar el usuario: ' + error.message);
        }
    }

    static async obtenerPorCorreo(correo) {
        try {
            return await Usuarios.obtenerPorCorreo(correo);
        } catch (error) {
            throw new Error('Error al obtener usuario por correo: ' + error.message);
        }
    }
}

module.exports = UsuariosService;