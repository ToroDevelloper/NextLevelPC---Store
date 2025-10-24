const Usuarios = require('../models/Usuarios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsuariosService = require('../services/UsuariosService');

class UsuariosController {
    
    static async crear(req, res) {
        try {
            const data = req.body;
            const usuarioId = await UsuariosService.crear(data);
            const usuario = await Usuarios.obtenerPorId(usuarioId);
            res.status(201).json({
                success: true,
                mensaje: 'Usuario registrado exitosamente',
                usuario: usuario
            });

        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({
                success: false,
                mensaje: 'Error interno del servidor: ' + error.message
            });
        }
    }

    static async login(req, res) {
        try {
            const data = req.body;
            const token = await UsuariosService.login(data);
            res.status(201).json({
                success: true,
                mensaje: 'Login exitoso',
                access_token:token
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                mensaje: 'Error interno del servidor' + error.message
            });
        }
    }

    static async obtenerTodos(req, res) {
        try {
            const usuarios = await UsuariosService.obtenerTodos();
            res.status(201).json({
                success: true,
                usuarios: usuarios
            });
        } catch (error) {
            console.error('Error obteniendo usuarios:', error);
            res.status(500).json({
                success: false,
                mensaje: 'Error interno del servidor' + error.message
            });
        }
    }

    static async obtenerPorId(req, res) {
        try {
            const { id } = req.params;

            if(req.usuario.rol_id !== 1 && req.usuario.id !== parseInt(id)){
                return res.status(401).json({message:'Solo puedes ver tu usuario'})
            }

            const usuario = await UsuariosService.obtenerPorId(id);

            res.status(201).json({
                success: true,
                usuario: usuario
            });
        } catch (error) {
            console.error('Error obteniendo usuario:', error);
            res.status(500).json({
                success: false,
                mensaje: 'Error interno del servidor' + error.message
            });
        }
    }

    static async actualizar(req, res) {
        try {
            const { id } = req.params;
            const datosActualizados = req.body;
            await UsuariosService.actualizar(id, datosActualizados);
            const usuario = await Usuarios.obtenerPorId(id);
            res.status(201).json({
                success: true,
                mensaje: 'Usuario actualizado exitosamente',
                usuario: usuario
            });
        } catch (error) {
            console.error('Error actualizando usuario:', error);
            res.status(500).json({
                success: false,
                mensaje: 'Error interno del servidor' + error.message
            });
        }
    }

    static async eliminar(req, res) {
        try {
            const { id } = req.params;
            await UsuariosService.eliminar(id);
            res.status(201).json({
                success: true,
                mensaje: 'Usuario eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error eliminando usuario:', error);
            res.status(500).json({
                success: false,
                mensaje: 'Error interno del servidor' + error.message
            });
        }
    }
}

module.exports = UsuariosController;