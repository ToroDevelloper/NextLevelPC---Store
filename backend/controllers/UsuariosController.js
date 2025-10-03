const usuariosService = require('../services/usuariosService.js');

class UsuariosController {
    static async crear(req, res) {
        try {
            const data = req.body;
            const { correo } = data;

            const email = await usuariosService.obtenerPorCorreo(correo);
            if (email) {
                return res.status(400).json({ mensaje: 'Correo en uso por otro usuario' });
            }

            const insertId = await usuariosService.crear(data);
            const nuevoUsuario = await usuariosService.obtenerPorId(insertId);

            res.status(201).json({ mensaje: 'Usuario creado exitosamente', usuario: nuevoUsuario });
        } catch (error) {
            console.error("Error en crear:", error);
            res.status(500).json({ mensaje: 'Error al crear el usuario' });
        }
    }

    static async obtenerTodos(req, res) {
        try {
            const usuarios = await usuariosService.obtenerTodos();
            res.status(200).json(usuarios);
        } catch (error) {
            console.error("Error en obtenerTodos:", error);
            res.status(500).json({ mensaje: 'Error al obtener los usuarios' });
        }
    }

    static async obtenerPorId(req, res) {
        try {
            const id = req.params.id;
            const usuario = await usuariosService.obtenerPorId(id);

            if (!usuario) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }

            res.status(200).json(usuario);
        } catch (error) {
            console.error("Error en obtenerPorId:", error);
            res.status(500).json({ mensaje: 'Error al obtener el usuario' });
        }
    }

    static async actualizar(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            const actualizado = await usuariosService.actualizar(id, data);

            if (!actualizado) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }

            res.status(200).json({ mensaje: 'Usuario actualizado exitosamente' });
        } catch (error) {
            console.error("Error en actualizar:", error);
            res.status(500).json({ mensaje: 'Error al actualizar el usuario' });
        }
    }

    static async eliminar(req, res) {
        try {
            const id = req.params.id;
            const eliminado = await usuariosService.eliminar(id);

            if (!eliminado) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            }

            res.status(200).json({ mensaje: 'Usuario eliminado exitosamente' });
        } catch (error) {
            console.error("Error en eliminar:", error);
            res.status(500).json({ mensaje: 'Error al eliminar el usuario' });
        }
    }
}

module.exports = UsuariosController;
