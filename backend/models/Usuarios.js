const bcrypt = require('bcrypt');
const { executeQuery } = require('../config/db.js');

class Usuarios {

    static async crear(dto) {
        const { nombre, apellido, correo, hash_password, rol_id} = dto;
        const hashPassword = await bcrypt.hash(hash_password, 10);

        const columns = ['nombre', 'apellido', 'correo', 'hash_password', 'rol_id'];
        const values = [nombre, apellido, correo, hashPassword, rol_id];

        if (dto.username !== undefined) {
            columns.push('username');
            values.push(dto.username);
        }
        if (dto.foto_perfil !== undefined) {
            columns.push('foto_perfil');
            values.push(dto.foto_perfil);
        }
        if (dto.bibliografia !== undefined) {
            columns.push('bibliografia');
            values.push(dto.bibliografia);
        }
        if (dto.estado !== undefined) {
            columns.push('estado');
            values.push(dto.estado);
        }

        const result = await executeQuery(
            `INSERT INTO usuarios (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
            values
        );

        return result.insertId;
    }

    static async usernameEnUso(username, id) {
        const result = await executeQuery('SELECT * FROM usuarios WHERE username = ? AND id <> ?', [username, id]);
        return result.length > 0 ? result[0] : null;
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
        const query = `
            SELECT u.*, r.nombre as rol_nombre 
            FROM usuarios u 
            LEFT JOIN roles r ON u.rol_id = r.id 
            WHERE u.correo = ?
        `;
        const result = await executeQuery(query, [correo]);
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

    static async obtenerRoles(){
        return await executeQuery(`
    SELECT u.*, r.nombre AS rol
    FROM usuarios u
    LEFT JOIN roles r ON u.rol_id = r.id
`);
    }

    static async guardarRefreshToken(userId, token, expiresAt) {
    const result = await executeQuery(`
        INSERT INTO refresh_tokens (user_id, token, expires_at)
        VALUES (?, ?, ?);
    `, [userId, token, expiresAt]); 
    return result;
}

static async obtenerRefreshToken(token) {
    const [rows] = await executeQuery(`
        SELECT user_id
        FROM refresh_tokens
        WHERE token = ? AND expires_at > NOW();
    `, [token]);
    return rows.length > 0 ? rows[0] : null; 
}

static async eliminarRefreshToken(token) {
    const result = await executeQuery(`
        DELETE FROM refresh_tokens
        WHERE token = ?;
    `, [token]);
    return result.affectedRows > 0; 
}
}

module.exports = Usuarios;
