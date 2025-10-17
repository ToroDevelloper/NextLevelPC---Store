const usuariosService = require('../services/usuariosService.js');

class UsuariosController {

    static async crear(req, res) {
        try {
            const data = req.body;
            const insertId = await usuariosService.crear(data);
            const nuevoUsuario = await usuariosService.obtenerPorId(insertId);
            res.status(201).json({ mensaje: 'Usuario creado exitosamente', usuario: nuevoUsuario });
        } catch (error) {
            console.error("Error en crear:", error);
            res.status(500).json({ mensaje: 'Error al crear el usuario',error: error.message});
        }
    }

    static async obtenerTodos(req, res) {
        try {
            const usuarios = await usuariosService.obtenerTodos();
            res.status(200).json(usuarios);
        } catch (error) {
            console.error("Error en obtenerTodos:", error);
            res.status(500).json({ mensaje: 'Error al obtener los usuarios',error: error.message});
        }
    }

    static async obtenerPorId(req, res) {
        try {
            const id = req.params.id;
            if(req.usuario.id != id && req.usuario.rol_id != 1){
                return res.status(403).json({ mensaje: 'No tienes permisos para ver este usuario' });
            }
            const usuario = await usuariosService.obtenerPorId(id);
            res.status(200).json(usuario);
        } catch (error) {
            console.error("Error en obtenerPorId:", error);
            res.status(500).json({ mensaje: 'Error al obtener el usuario',error: error.message});
        }
    }

    static async actualizar(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            if(req.usuario.id != id && req.usuario.rol_id != 1){
                return res.status(403).json({ mensaje: 'No tienes permisos para actualizar este usuario' });
            }
            const actualizado = await usuariosService.actualizar(id, data);
            res.status(200).json({ mensaje: 'Usuario actualizado exitosamente',usuario: actualizado });
        } catch (error) {
            console.error("Error en actualizar:", error);
            res.status(500).json({ mensaje: 'Error al actualizar el usuario',error: error.message});
        }
    }

    static async eliminar(req, res) {
        try {
            const id = req.params.id;
            await usuariosService.eliminar(id);
            res.status(200).json({ mensaje: 'Usuario eliminado exitosamente' });
        } catch (error) {
            console.error("Error en eliminar:", error);
            res.status(500).json({ mensaje: 'Error al eliminar el usuario',error: error.message});
        }
    }

    static async login(req, res) {
        try {
            const {correo, hash_password} = req.body;
            const token = await usuariosService.login(correo, hash_password);
            res.status(200).json({ mensaje: 'Login exitoso', access_token: token });
        } catch (error) {
            console.error("Error en login:", error);
            if (error && error.message === 'Credenciales inválidas') {
                return res.status(401).json({ mensaje: 'Credenciales inválidas' });
            }
            res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
        }
    }

}

module.exports = UsuariosController;
