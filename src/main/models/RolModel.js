const db = require('../config/db');

const RolModel = {
    // Obtener todos los roles
    getAll: (callback) => {
        const sql = 'SELECT * FROM roles';
        db.query(sql, callback);
    },

    // Buscar rol por ID
    getById: (id, callback) => {
        const sql = 'SELECT * FROM roles WHERE id = ?';
        db.query(sql, [id], callback);
    },

    // Crear nuevo rol
    create: (rol, callback) => {
        const sql = 'INSERT INTO roles (nombre, descripcion) VALUES (?, ?)';
        db.query(sql, [rol.nombre, rol.descripcion], callback);
    },

    // Actualizar un rol
    update: (id, rol, callback) => {
        const sql = 'UPDATE roles SET nombre = ?, descripcion = ? WHERE id = ?';
        db.query(sql, [rol.nombre, rol.descripcion, id], callback);
    },

    // Eliminar un rol
    delete: (id, callback) => {
        const sql = 'DELETE FROM roles WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = RolModel;
