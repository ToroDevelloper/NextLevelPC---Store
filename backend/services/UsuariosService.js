const Usuarios = require('../models/Usuarios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UsuarioCreateDTO, UsuarioUpdateDTO, LoginDTO } = require('../dto/UsuariosDto');

class UsuariosService {
    static async crear(datos) {
        const dto = new UsuarioCreateDTO(datos);
        const errores = dto.validate();
        if (errores.length > 0) {
            throw new Error('Errores de validación: ' + errores.join(', '));
        }
        
        const usuarioExistente = await Usuarios.obtenerPorCorreo(dto.correo);
        if (usuarioExistente) {
            throw new Error('Ya existe un usuario con ese correo');
        }

        const id = await Usuarios.crear(dto.toModel());
        return id;
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
        const usuarioExistente = await Usuarios.obtenerPorId(id);
        if (!usuarioExistente) {
            throw new Error('Usuario no encontrado');
        }

        const dto = new UsuarioUpdateDTO(datos);
        const errores = dto.validate();
        if (errores.length > 0) {
            throw new Error('Errores de validación: ' + errores.join(', '));
        }

        const patch = dto.toPatchObject();
        if (Object.keys(patch).length === 0) {
            throw new Error('No hay campos válidos para actualizar');
        }

        if (patch.correo) {
            const correoEnUso = await Usuarios.correoEnUso(patch.correo, id);
            if (correoEnUso) {
                throw new Error('Ya existe un usuario con ese correo');
            }
        }

        const actualizado = await Usuarios.actualizar(id, patch);
        if (!actualizado) {
            throw new Error('No se pudo actualizar el usuario');
        }

        return actualizado;
    }

    static async eliminar(id) {
        const usuarioExistente = await Usuarios.obtenerPorId(id);
        if (!usuarioExistente) {
            throw new Error('Usuario no encontrado');
        }
        return await Usuarios.eliminar(id);
    }

    static async login(data) {
        const dto = new LoginDTO(data);
        const errores = dto.validate();
        if (errores.length > 0) {
            throw new Error('Errores de validación: ' + errores.join(', '));
        }
        const usuario = await Usuarios.obtenerPorCorreo(dto.toLogin().correo);
        if (!usuario) {
            throw new Error('Credenciales inválidas');
        }
        const passwordValido = await bcrypt.compare(dto.toLogin().hash_password, usuario.hash_password);
        if (!passwordValido) {
            throw new Error('Credenciales inválidas');
        }
        
        const token = await jwt.sign({ 
            id: usuario.id, 
            correo: usuario.correo, 
            rol_id: usuario.rol_id 
        }, process.env.JWT_SECRET || 'fallback_secret_key', { 
            expiresIn: '1h' 
        });
        return token;
    }

    //MÉTODO PARA OBTENER CLIENTES (necesario para órdenes)
    static async obtenerClientes() {
        try {
            const usuarios = await Usuarios.obtenerTodos();
            const clientes = usuarios.filter(usuario => usuario.rol_id === 2);
            return clientes;
        } catch (error) {
            throw new Error('Error al obtener clientes: ' + error.message);
        }
    }
}

module.exports = UsuariosService;