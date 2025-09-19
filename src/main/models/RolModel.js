const db = require('../config/db.js');

class RolModel {

    // Obtener todos los roles
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM roles');
        return rows;
    }

    // Buscar rol por ID
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM roles WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    // Crear nuevo rol
    static async create(rol) {
        const { nombre, descripcion } = rol;
        const [result] = await db.query(
            'INSERT INTO roles (nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion]
        );
        return result.insertId;
    }

    // Actualizar un rol
    static async update(id, rol) {
        const { nombre, descripcion } = rol;
        const [result] = await db.query(
            'UPDATE roles SET nombre = ?, descripcion = ? WHERE id = ?',
            [nombre, descripcion, id]
        );
        return result.affectedRows; // devuelve cuántos registros fueron actualizados
    }

    // Eliminar un rol
    static async delete(id) {
        const [result] = await db.query('DELETE FROM roles WHERE id = ?', [id]);
        return result.affectedRows; // devuelve cuántos registros fueron eliminados
    }
}

module.exports = RolModel;
