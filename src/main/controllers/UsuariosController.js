const db = require('../config/db.js');
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

    static async crear(req,res){
        try{
        const data = req.body;
        const {Nombre,Apellido,Cedula,Celular,Correo,Password,Direccion} = data;
        const email = await Usuarios.correo(Correo);
        if(email){
           return res.status(400).json({mensaje:'Correo en uso por otro usuario'})
        }
        const result = await Usuarios.crear(data);
        res.status(201).json({mensaje:'Usuario creado exitosamente'})
    }catch(error){
          res.status(500).json({mensaje:'Error al crear el usuario'})
        }
    }
}

module.exports = UsuariosController;
