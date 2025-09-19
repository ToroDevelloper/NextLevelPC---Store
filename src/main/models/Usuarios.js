const db = require('../config/db.js')

class Usuarios{
    constructor(ID_Usuario,Nombre,Apellido,Cedula,Celular,Correo,Password,Direccion,ID_Rol){
      this.ID_Usuarioc= ID_Usuario,
      this.Nombre = Nombre,
      this.Apellido = Apellido,
      this.Cedula = Cedula,
      this.Celular = Celular,
      this.Correo = Correo,
      this.Password = Password,
      this.Direccion = Direccion,
      this.ID_Rol = ID_Rol
    }

    static async obtenerTodos(){
      const [rows] =  await db.query('SELECT * FROM usuarios')
      return rows;
    }

    static async crear(data) {
  const { Nombre, Apellido, Cedula, Celular, Correo, Password, Direccion } = data;

  const [result] = await db.query(
    'INSERT INTO usuarios (Nombre, Apellido, Cedula, Celular, Correo, Password, Direccion, ID_Rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [Nombre, Apellido, Cedula, Celular, Correo, Password, Direccion, 2] 
  );

  return result.insertId; 
}


    static async correo(Correo){
      const [result] = await db.query('SELECT * FROM usuarios WHERE Correo = ?;',[Correo])
      return result.length > 0 ? result[0] : null;
    }
}

module.exports = Usuarios;
