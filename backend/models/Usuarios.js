const bcrypt = require('bcrypt');
const { executeQuery } = require('../config/db.js');

class Usuarios {

    static async crear(dto) {
        const { nombre, apellido, correo, hash_password} = dto;
        const hashPassword = await bcrypt.hash(hash_password, 10);

        const result = await executeQuery(
            'INSERT INTO usuarios (nombre, apellido, correo, hash_password) VALUES (?, ?, ?, ?)',
            [nombre, apellido, correo, hashPassword]
        );

        return result.insertId;
    }

    static async obtenerTodos() {
       const usuarios = await executeQuery('SELECT * FROM usuarios');
    return usuarios;
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

    static async actualizar(id, dto) {
    if (dto.hash_password && !dto.hash_password.startsWith('$2b$')) {
        const hashPassword = await bcrypt.hash(dto.hash_password, 10);
        dto.hash_password = hashPassword;
    }

        const campos = Object.keys(dto);
        const columnas = campos.map(campo => `${campo} = ?`).join(', ');
        const valores = Object.values(dto);

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
