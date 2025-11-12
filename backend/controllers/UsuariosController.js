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
            const { accessToken, refreshToken } = await UsuariosService.login(data);
            
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'strict', 
                path: '/'
            });

            res.status(200).json({
                success: true,
                mensaje: 'Login exitoso',
                access_token: accessToken 
            });

        } catch (error) {
            console.error('Error en login:', error);
            const statusCode = error.message.includes('Credenciales inválidas') ? 401 : 500;
            res.status(statusCode).json({
                success: false,
                mensaje: error.message
            });
        }
    }

    static async refresh(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            
            if (!refreshToken) {
                return res.status(401).json({ 
                    success: false, 
                    mensaje: 'No autorizado. Se requiere token de refresco.' 
                });
            }

            const { newAccessToken } = await UsuariosService.refreshTokens(refreshToken);

            res.status(200).json({
                success: true,
                mensaje: 'Token de acceso renovado exitosamente',
                access_token: newAccessToken
            });

        } catch (error) {
            console.error('Error al refrescar token:', error);
            res.status(403).json({
                success: false,
                mensaje: 'Token de refresco inválido o expirado. Vuelva a iniciar sesión.'
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