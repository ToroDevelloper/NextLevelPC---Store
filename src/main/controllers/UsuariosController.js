const Usuarios = require('../models/Usuarios.js')

class UsuariosController{

    static async obtenerTodos(req,res){
        try {
            const data = await Usuarios.obtenerTodos();
           res.json(data);
        } catch (error) {
           res.status(500).json({mensaje:'Error al obtener usuarios',error})
        }
    }
}

module.exports = UsuariosController;
