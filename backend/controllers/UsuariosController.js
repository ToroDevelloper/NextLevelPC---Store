// controllers/UsuariosController.js
const Usuarios = require('../models/Usuarios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UsuariosController {
    
    // Método para crear usuario (registro)
    static async crear(req, res) {
        try {
            const { nombre, apellido, correo, hash_password, rol_id = 2 } = req.body;

            // Validar campos obligatorios
            if (!nombre || !correo || !hash_password) {
                return res.status(400).json({
                    success: false,
                    mensaje: 'Nombre, correo y contraseña son obligatorios'
                });
            }

            // Verificar si el correo ya existe
            const usuarioExistente = await Usuarios.obtenerPorCorreo(correo);
            if (usuarioExistente) {
                return res.status(400).json({
                    success: false,
                    mensaje: 'El correo electrónico ya está registrado'
                });
            }

            // Crear el usuario
            const usuarioId = await Usuarios.crear({
                nombre,
                apellido: apellido || '',
                correo,
                hash_password,
                rol_id
            });

            res.status(201).json({
                success: true,
                mensaje: 'Usuario registrado exitosamente',
                data: {
                    id: usuarioId,
                    nombre,
                    correo
                }
            });

        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({
                success: false,
                mensaje: 'Error interno del servidor'
            });
        }
    }

    // Método para login (ya lo debes tener)
    static async login(req, res) {
        try {
            const { correo, hash_password } = req.body;

            if (!correo || !hash_password) {
                return res.status(400).json({
                    success: false,
                    mensaje: 'Correo y contraseña son obligatorios'
                });
            }

            const usuario = await Usuarios.obtenerPorCorreo(correo);
            if (!usuario) {
                return res.status(401).json({
                    success: false,
                    mensaje: 'Credenciales inválidas'
                });
            }

            const passwordValida = await bcrypt.compare(hash_password, usuario.hash_password);
            if (!passwordValida) {
                return res.status(401).json({
                    success: false,
                    mensaje: 'Credenciales inválidas'
                });
            }

            // Generar token
            const token = jwt.sign(
                { 
                    id: usuario.id, 
                    correo: usuario.correo,
                    rol_id: usuario.rol_id 
                },
                process.env.JWT_SECRET || 'secreto_por_defecto',
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                mensaje: 'Login exitoso',
                data: {
                    token,
                    usuario: {
                        id: usuario.id,
                        nombre: usuario.nombre,
                        correo: usuario.correo,
                        rol_id: usuario.rol_id
                    }
                }
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                mensaje: 'Error interno del servidor'
            });
        }
    }

    // Tus otros métodos (obtenerTodos, obtenerPorId, actualizar, eliminar)...
    static async obtenerTodos(req, res) {
        try {
            const usuarios = await Usuarios.obtenerTodos();
            res.json({
                success: true,
                data: usuarios
            });
        } catch (error) {
            console.error('Error obteniendo usuarios:', error);
            res.status(500).json({
                success: false,
                mensaje: 'Error interno del servidor'
            });
        }
    }

    static async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            const usuario = await Usuarios.obtenerPorId(id);
            
            if (!usuario) {
                return res.status(404).json({
                    success: false,
                    mensaje: 'Usuario no encontrado'
                });
            }

            res.json({
                success: true,
                data: usuario
            });
        } catch (error) {
            console.error('Error obteniendo usuario:', error);
            res.status(500).json({
                success: false,
                mensaje: 'Error interno del servidor'
            });
        }
    }

    static async actualizar(req, res) {
        try {
            const { id } = req.params;
            const datosActualizados = req.body;

            const actualizado = await Usuarios.actualizar(id, datosActualizados);
            
            if (!actualizado) {
                return res.status(404).json({
                    success: false,
                    mensaje: 'Usuario no encontrado'
                });
            }

            res.json({
                success: true,
                mensaje: 'Usuario actualizado exitosamente'
            });
        } catch (error) {
            console.error('Error actualizando usuario:', error);
            res.status(500).json({
                success: false,
                mensaje: 'Error interno del servidor'
            });
        }
    }

    static async eliminar(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await Usuarios.eliminar(id);
            
            if (!eliminado) {
                return res.status(404).json({
                    success: false,
                    mensaje: 'Usuario no encontrado'
                });
            }

            res.json({
                success: true,
                mensaje: 'Usuario eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error eliminando usuario:', error);
            res.status(500).json({
                success: false,
                mensaje: 'Error interno del servidor'
            });
        }
    }
}

module.exports = UsuariosController;