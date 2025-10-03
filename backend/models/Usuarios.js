const { executeQuery } = require('../config/db.js');
const bcrypt = require('bcrypt');

class Usuarios {
    constructor(ID_Usuario, Nombre, Apellido, Cedula, Celular, Correo, Password, Direccion, ID_Rol) {
        this.ID_Usuario = ID_Usuario;
        this.Nombre = Nombre;
        this.Apellido = Apellido;
        this.Cedula = Cedula;
        this.Celular = Celular;
        this.Correo = Correo;
        this.Password = Password;
        this.Direccion = Direccion;
        this.ID_Rol = ID_Rol;
    }

    static async obtenerTodos() {
        const rows = await executeQuery('SELECT * FROM usuarios');
        return rows;
    }

    static async obtenerPorId(id) {
        const rows = await executeQuery("SELECT * FROM usuarios WHERE ID_Usuario = ?", [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async crear(data) {
        const { Nombre, Apellido, Cedula, Celular, Correo, Password, Direccion } = data;
        const hashPassword = await bcrypt.hash(Password, 10);
        const result = await executeQuery(
            'INSERT INTO usuarios (Nombre, Apellido, Cedula, Celular, Correo, Contraseña, Direccion, ID_Rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [Nombre, Apellido, Cedula, Celular, Correo, hashPassword, Direccion, 2]
        );
        return result.insertId;
    }

    static async eliminar(id) {
        const result = await executeQuery('DELETE FROM usuarios WHERE ID_Usuario = ?', [id]);
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

        // Mapear campos a las columnas reales de la base de datos
        const updates = [];
        const values = [];

        for (const campo in data) {
            switch (campo) {
                case 'Nombre':
                    updates.push('Nombre = ?');
                    values.push(data[campo]);
                    break;
                case 'Apellido':
                    updates.push('Apellido = ?');
                    values.push(data[campo]);
                    break;
                case 'Cedula':
                    updates.push('Cedula = ?');
                    values.push(data[campo]);
                    break;
                case 'Celular':
                    updates.push('Celular = ?');
                    values.push(data[campo]);
                    break;
                case 'Correo':
                    updates.push('Correo = ?');
                    values.push(data[campo]);
                    break;
                case 'Password':
                    updates.push('Contraseña = ?');
                    values.push(data[campo]);
                    break;
                case 'Direccion':
                    updates.push('Direccion = ?');
                    values.push(data[campo]);
                    break;
                case 'ID_Rol':
                    updates.push('ID_Rol = ?');
                    values.push(data[campo]);
                    break;
            }
        }

        if (updates.length === 0) {
            return false;
        }

        const columnas = updates.join(", ");
        values.push(id); // ID para WHERE

        const result = await executeQuery(
            `UPDATE usuarios SET ${columnas} WHERE ID_Usuario = ?`,
            values
        );

        return result.affectedRows > 0;
    }

    static async obtenerPorCorreo(correo) {
        const rows = await executeQuery("SELECT * FROM usuarios WHERE Correo = ?", [correo]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async correoEnUsoPorOtroUsuario(correo, id) {
        const rows = await executeQuery(
            "SELECT ID_Usuario FROM usuarios WHERE Correo = ? AND ID_Usuario != ?",
            [correo, id]
        );
        return rows.length > 0;
    }

    static async correo(correo) {
        const rows = await executeQuery("SELECT * FROM usuarios WHERE Correo = ?", [correo]);
        return rows.length > 0 ? rows[0] : null;
    }
}

module.exports = Usuarios;