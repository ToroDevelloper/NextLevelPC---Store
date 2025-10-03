const { executeQuery } = require('../config/db.js');

class Productos {
    static async crear(data) {
        const { nombre, categoria_id, precio_actual, stock, activo } = data;

        const result = await executeQuery(
            'INSERT INTO productos (nombre, categoria_id, precio_actual, stock, activo) VALUES (?, ?, ?, ?, ?)',
            [nombre, categoria_id, precio_actual, stock, activo || 1]
        );

        return result.insertId;
    }

    static async obtenerTodos() {
        return await executeQuery('SELECT * FROM productos');
    }

    static async obtenerActivos() {
        return await executeQuery('SELECT * FROM productos WHERE activo = 1');
    }

    static async obtenerPorId(id) {
        const result = await executeQuery('SELECT * FROM productos WHERE id = ?', [id]);
        return result.length > 0 ? result[0] : null;
    }

    static async obtenerPorCategoria(categoria_id) {
        return await executeQuery('SELECT * FROM productos WHERE categoria_id = ?', [categoria_id]);
    }

    static async actualizar(id, data) {
        const campos = Object.keys(data);
        const columnas = campos.map(campo => `${campo} = ?`).join(', ');
        const valores = Object.values(data);

        const result = await executeQuery(
            `UPDATE productos SET ${columnas} WHERE id = ?`,
            [...valores, id]
        );

        return result.affectedRows > 0;
    }

    static async actualizarStock(id, nuevoStock) {
        const result = await executeQuery(
            'UPDATE productos SET stock = ? WHERE id = ?',
            [nuevoStock, id]
        );

        return result.affectedRows > 0;
    }

    static async eliminar(id) {
        const result = await executeQuery('DELETE FROM productos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async desactivar(id) {
        const result = await executeQuery('UPDATE productos SET activo = 0 WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async activar(id) {
        const result = await executeQuery('UPDATE productos SET activo = 1 WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Productos;