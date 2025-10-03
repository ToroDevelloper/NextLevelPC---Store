const bcrypt = require('bcrypt');
const { executeQuery } = require('../config/db.js');

class Usuarios {

    constructor(id, nombre, apellido, correo, hash_password, rol_id) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.hash_password = hash_password;
        this.rol_id = rol_id;
    }

    static async crear(data) {
        const { nombre, apellido, correo, hash_password, rol_id } = data;
        const hashPassword = await bcrypt.hash(hash_password, 10);

        const result = await executeQuery(
            'INSERT INTO usuarios (nombre, apellido, correo, hash_password, rol_id) VALUES (?, ?, ?, ?, ?)',
            [nombre, apellido, correo, hashPassword, rol_id]
        );

        return result.insertId;
    }

    static async obtenerTodos() {
       const usuarios = executeQuery('SELECT * FROM usuarios');
       return usuarios.length> 0 ? usuarios[0] : null;
    }

    static async obtenerPorId(id) {
        const result = await executeQuery('SELECT * FROM usuarios WHERE id = ?', [id]);
        return result.length > 0 ? result[0] : null;
    }

    static async obtenerPorCorreo(correo) {
        const result = await executeQuery('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        return result.length > 0 ? result[0] : null;
    }

     static async correoEnUso(correo,id) {
        const result = await executeQuery('SELECT * FROM usuarios WHERE correo = ? AND id <> ?', [correo,id]);
        return result.length > 0 ? result[0] : null;
    }

    static async actualizar(id, data) {
       if (data.hash_password && !data.hash_password.startsWith('$2b$')) {
        const hashPassword = await bcrypt.hash(data.hash_password, 10);
        data.hash_password = hashPassword;
       }

        const campos = Object.keys(data);
        const columnas = campos.map(campo => `${campo} = ?`).join(', ');
        const valores = Object.values(data);

        const result = await executeQuery(
            `UPDATE usuarios SET ${columnas} WHERE id = ?`,
            [...valores, id]
        );

        return result.affectedRows > 0;
    }

    static async eliminar(id) {
        const result = await executeQuery('DELETE FROM usuarios WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Usuarios;
