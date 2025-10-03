const Usuarios = require('../models/Usuarios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UsuariosService {
    static async crear(datosUsuario) {

            if (!datosUsuario) {
                throw new Error('No se proporcionaron datos del usuario');
            }

              const usuario = {
                nombre: datosUsuario.nombre,
                apellido: datosUsuario.apellido,
                correo: datosUsuario.correo,
                hash_password: datosUsuario.hash_password,
                rol_id: datosUsuario.rol_id 
            };

            const usuarioExistente = await Usuarios.obtenerPorCorreo(usuario.correo);
            if (usuarioExistente) {
                throw new Error('Ya existe un usuario con ese correo');
            }

            return await Usuarios.crear(usuario);
    
    }

    static async obtenerTodos() {
        const usuarios = await Usuarios.obtenerTodos();
        if (!usuarios || usuarios.length === 0) {
            throw new Error('No se encontraron usuarios');
        }
        return usuarios;
    }

    static async obtenerPorId(id) {
        const usuario = await Usuarios.obtenerPorId(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        return usuario;
    }

    static async obtenerPorCorreo(correo) {
        const usuario = await Usuarios.obtenerPorCorreo(correo);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        return usuario;
    }

    static async actualizar(id, datos) {

        if(!datos || Object.keys(datos).length === 0) {
            throw new Error('No se proporcionaron datos para actualizar');
        }

        const usuarioExistente = await Usuarios.obtenerPorId(id);
        if (!usuarioExistente) {
            throw new Error('Usuario no encontrado');
        }

        const correoExistente = await Usuarios.correoEnUso(datos.correo,id);
        if (correoExistente){
            throw new Error('Ya existe un usuario con ese correo');
        }

        return await Usuarios.actualizar(id, datos);
    }

    static async eliminar(id) {
        const usuarioExistente = await Usuarios.obtenerPorId(id);
        if (!usuarioExistente) {
            throw new Error('Usuario no encontrado');
        }
        return await Usuarios.eliminar(id);
    }

    static async login(correo, password) {
        const usuario = await Usuarios.obtenerPorCorreo(correo);
        if (!usuario) {
            throw new Error('Credenciales inválidas');
        }
        const passwordValido = await bcrypt.compare(password, usuario.hash_password);
        if (!passwordValido) {
            throw new Error('Credenciales inválidas');
        }
        
        const token = await jwt.sign({ id: usuario.id, correo: usuario.correo, rol_id: usuario.rol_id }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '1h' });
        return token;
    }

}

module.exports = UsuariosService;
