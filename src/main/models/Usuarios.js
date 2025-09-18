const db = require('../config/db.js')

class Usuarios{
    constructor(ID_Usuario,Nombre,Apellido,Cedula,Celular,Correo,Contrasena,Direccion,ID_Rol){
      this.ID_Usuarioc= ID_Usuario,
      this.Nombre = Nombre,
      this.Apellido = Apellido,
      this.Cedula = Cedula,
      this.Celular = Celular,
      this.Correo = Correo,
      this.Contrasena = Contrasena,
      this.Direccion = Direccion,
      this.ID_Rol = ID_Rol
    }

    static async obtenerTodos(){
      const [rows] =  await db.query('SELECT * FROM usuarios')
      return rows;
    }
}

module.exports = Usuarios;
