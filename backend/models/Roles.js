const { executeQuery } = require('../config/db.js');

class Roles {
    constructor(ID_Rol, Nombre, Descripcion, Created_at) {
        this.ID_Rol = ID_Rol;
        this.Nombre = Nombre;
        this.Descripcion = Descripcion;
        this.Created_at = Created_at;
    }

    static async obtenerTodos() {
        const rows = await executeQuery('SELECT * FROM roles ORDER BY ID_Rol');
        return rows;
    }

    static async obtenerPorId(id) {
        const rows = await executeQuery("SELECT * FROM roles WHERE ID_Rol = ?", [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async obtenerPorNombre(nombre) {
        const rows = await executeQuery("SELECT * FROM roles WHERE Nombre = ?", [nombre]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async crear(data) {
        const { Nombre, Descripcion } = data;
        const result = await executeQuery(
            'INSERT INTO roles (Nombre, Descripcion) VALUES (?, ?)',
            [Nombre, Descripcion]
        );
        return result.insertId;
    }

    static async eliminar(id) {
        const result = await executeQuery('DELETE FROM roles WHERE ID_Rol = ?', [id]);
        return result.affectedRows > 0;
    }

    static async actualizar(id, data) {
        const campos = Object.keys(data);
        if (campos.length === 0) return false;

        const columnas = campos.map(campo => `${campo} = ?`).join(", ");
        const valores = Object.values(data);

        const result = await executeQuery(
            `UPDATE roles SET ${columnas} WHERE ID_Rol = ?`,
            [...valores, id]
        );

        return result.affectedRows > 0;
    }

    static async nombreEnUsoPorOtroRol(nombre, id) {
        const rows = await executeQuery(
            "SELECT ID_Rol FROM roles WHERE Nombre = ? AND ID_Rol != ?",
            [nombre, id]
        );
        return rows.length > 0;
    }

    // Método adicional para obtener usuarios por rol
    static async obtenerUsuariosPorRol(idRol) {
        const rows = await executeQuery(
            "SELECT * FROM usuarios WHERE ID_Rol = ?",
            [idRol]
        );
        return rows;
    }

    // Método para verificar si un rol tiene usuarios asociados
    static async tieneUsuariosAsociados(idRol) {
        const rows = await executeQuery(
            "SELECT COUNT(*) as count FROM usuarios WHERE ID_Rol = ?",
            [idRol]
        );
        return rows[0].count > 0;
    }
}

module.exports = Roles;