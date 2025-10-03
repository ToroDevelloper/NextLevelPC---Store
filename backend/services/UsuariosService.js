const Usuarios = require('../models/Usuarios');

class UsuariosService {
    static async crear(datosUsuario) {
        try {
            // Validar campos requeridos
            if (!datosUsuario.nombre || !datosUsuario.correo || !datosUsuario.hash_password) {
                throw new Error('Nombre, correo y contraseña son requeridos');
            }

            // Verificar si el correo ya existe
            const usuarioExistente = await Usuarios.obtenerPorCorreo(datosUsuario.correo);
            if (usuarioExistente) {
                throw new Error('Ya existe un usuario con ese correo');
            }

            // Mapear correctamente los campos
            const usuario = {
                nombre: datosUsuario.nombre,
                apellido: datosUsuario.apellido,
                correo: datosUsuario.correo,
                hash_password: datosUsuario.hash_password,
                rol_id: datosUsuario.rol_id 
            };

            return await Usuarios.crear(usuario);
        } catch (error) {
            throw new Error('Error al crear el usuario: ' + error.message);
        }
    }

    static async obtenerTodos() {
        return await Usuarios.obtenerTodos();
    }

    static async obtenerPorId(id) {
        return await Usuarios.obtenerPorId(id);
    }

    static async obtenerPorCorreo(correo) {
        return await Usuarios.obtenerPorCorreo(correo);
    }

    static async actualizar(id, datos) {
        return await Usuarios.actualizar(id, datos);
    }

    static async eliminar(id) {
        return await Usuarios.eliminar(id);
    }
}

module.exports = UsuariosService;
