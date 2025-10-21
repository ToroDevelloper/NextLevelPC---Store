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
       const productos = await executeQuery('SELECT * FROM productos');
       return productos;
    }

    static async obtenerActivos() {
        const productos = await executeQuery('SELECT * FROM productos WHERE activo = 1');
        return productos;
    }

    static async obtenerPorId(id) {
        const result = await executeQuery('SELECT * FROM productos WHERE id = ?', [id]);
        return result.length > 0 ? result[0] : null;
    }

    static async obtenerPorCategoria(categoria_id) {
       const productos =  await executeQuery('SELECT * FROM productos WHERE categoria_id = ?', [categoria_id]);
       return productos;
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

    static async eliminar(id) {
        const result = await executeQuery('DELETE FROM productos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    
    static async productosConImagenes() {
        return await executeQuery(`
            SELECT p.*, 
                   GROUP_CONCAT(pi.url) AS imagenes
            FROM productos p
            LEFT JOIN imagenes_productos pi ON p.id = pi.producto_id
            GROUP BY p.id
        `);
    }
}

module.exports = Productos;
