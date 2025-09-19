const db = require('../config/db.js')
const bcrypt = require('bcrypt')

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

    static async obtenerPorId(id) {
  const [rows] = await db.query("SELECT * FROM usuarios WHERE ID_Usuario = ?", [id]);
  return rows.length > 0 ? rows[0] : null;
}


    static async crear(data) {
  const { Nombre, Apellido, Cedula, Celular, Correo, Password, Direccion } = data;
  const hashPassword = await bcrypt.hash(Password,10)
  const [result] = await db.query(
    'INSERT INTO usuarios (Nombre, Apellido, Cedula, Celular, Correo, Password, Direccion, ID_Rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [Nombre, Apellido, Cedula, Celular, Correo, hashPassword, Direccion, 2] 
  );

  return result.insertId; 
}

static async eliminar(id){
  const [result] = await db.query('DELETE FROM usuarios WHERE ID_Usuario =?',[id])
  return result.affectedRows > 0;
}

static async actualizar(id, data) {
        if (data.Password) {
            if (!data.Password.startsWith("$2b$")) {
                data.Password = await bcrypt.hash(data.Password, 10);
            }
        }

        const campos = Object.keys(data);
        if (campos.length === 0) return false;

        const columnas = campos.map(campo => `${campo} = ?`).join(", ");
        const valores = Object.values(data);

        const [result] = await db.query(
            `UPDATE usuarios SET ${columnas} WHERE ID_Usuario = ?`,
            [...valores, id]
        );

        return result.affectedRows > 0;
    }




   static async obtenerPorCorreo(correo) {
        const [rows] = await db.query("SELECT * FROM usuarios WHERE Correo = ?", [correo]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async correoEnUsoPorOtroUsuario(correo, id) {
        const [rows] = await db.query(
            "SELECT ID_Usuario FROM usuarios WHERE Correo = ? AND ID_Usuario != ?",
            [correo, id]
        );
        return rows.length > 0;
    }
}

module.exports = Usuarios;
