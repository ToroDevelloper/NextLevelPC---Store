const { hash } = require('bcryptjs');
const db = require('../config/db.js');
const Usuarios = require('../models/Usuarios.js')

class UsuariosController{

     static async obtenerTodos(req, res) {
        try {
            const data = await Usuarios.obtenerTodos();
            res.json(data);
        } catch (error) {
            console.error("Error en obtenerTodos:", error);
            res.status(500).json({ mensaje: 'Error al obtener usuarios', error });
        }
    }

   static async obtenerPorId(req, res) {
    try {
        const { id } = req.params;
        const usuario = await Usuarios.obtenerPorId(id);

        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error("Error en obtenerPorId:", error);
        res.status(500).json({ mensaje: "Error al obtener usuario"});
    }
}


    static async crear(req, res) {
        try {
            const data = req.body;
            const { Correo } = data;

            const email = await Usuarios.correo(Correo);
            if (email) {
                return res.status(400).json({ mensaje: 'Correo en uso por otro usuario' });
            }

            const insertId = await Usuarios.crear(data);

            const nuevoUsuario = await Usuarios.obtenerPorId(insertId);

            res.status(201).json({ mensaje: 'Usuario creado exitosamente', usuario: nuevoUsuario });
        } catch (error) {
            console.error("Error en crear:", error);
            res.status(500).json({ mensaje: 'Error al crear el usuario'});
        }
    }

static async actualizar(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;

        if (data.Correo) {
            const email = await Usuarios.correoEnUsoPorOtroUsuario(data.Correo, id);
            if (email) {
                return res.status(400).json({ mensaje: 'Correo en uso por otro usuario' });
            }
        }

        const actualizado = await Usuarios.actualizar(id, data);

        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const usuarioActualizado = await Usuarios.obtenerPorId(id);

        res.status(200).json({
            mensaje: 'Usuario actualizado correctamente',
            usuario: usuarioActualizado
        });
    } catch (error) {
        console.error("Error en actualizar:", error);
        res.status(500).json({ mensaje: 'Error al actualizar usuario' });
    }
}



    static async eliminar(req,res){
        try {
            const {id} = req.params;
            const eliminar = await Usuarios.eliminar(id);
            res.status(201).json({mensaje:'Usuario eliminado'})
        } catch (error) {
            console.error('Error al eliminar: ',error)
            res.status(500).json({mensaje:'Usuario no encontrado'})
        }
    }

}

module.exports = UsuariosController;
