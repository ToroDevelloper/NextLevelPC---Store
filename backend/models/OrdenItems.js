const { executeQuery } = require('../config/db');

class OrdenItems {
    static async crear(data) {
        const { 
            orden_id, 
            tipo, 
            producto_id, 
            servicio_id, 
            descripcion, 
            cantidad = 1, 
            precio_unitario 
        } = data;

        // Validaciones básicas
        if (!orden_id || !tipo || !descripcion || !precio_unitario) {
            throw new Error('Faltan campos requeridos');
        }

        const subtotal = precio_unitario * cantidad;

        const result = await executeQuery(
            `INSERT INTO orden_items 
             (orden_id, tipo, producto_id, servicio_id, descripcion, cantidad, precio_unitario, subtotal) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [orden_id, tipo, producto_id, servicio_id, descripcion, cantidad, precio_unitario, subtotal]
        );

        return result.insertId;
    }

    static async obtenerTodos() {
        return await executeQuery(`
            SELECT oi.*,
                   p.nombre as producto_nombre,
                   s.nombre as servicio_nombre
            FROM orden_items oi 
            LEFT JOIN productos p ON oi.producto_id = p.id 
            LEFT JOIN servicios s ON oi.servicio_id = s.id
            ORDER BY oi.id DESC
        `);
    }

    static async obtenerPorId(id) {
        const result = await executeQuery(`
            SELECT oi.*,
                   p.nombre as producto_nombre,
                   s.nombre as servicio_nombre
            FROM orden_items oi 
            LEFT JOIN productos p ON oi.producto_id = p.id 
            LEFT JOIN servicios s ON oi.servicio_id = s.id
            WHERE oi.id = ?
        `, [id]);
        
        return result.length > 0 ? result[0] : null;
    }

    static async obtenerPorOrden(ordenId) {
        return await executeQuery(`
            SELECT oi.*,
                   p.nombre as producto_nombre,
                   s.nombre as servicio_nombre
            FROM orden_items oi 
            LEFT JOIN productos p ON oi.producto_id = p.id 
            LEFT JOIN servicios s ON oi.servicio_id = s.id 
            WHERE oi.orden_id = ?
            ORDER BY oi.id
        `, [ordenId]);
    }

    static async actualizar(id, data) {
        const camposPermitidos = ['cantidad', 'precio_unitario', 'subtotal', 'descripcion'];
        const campos = Object.keys(data).filter(campo => camposPermitidos.includes(campo));
        
        if (campos.length === 0) return false;

        const columnas = campos.map(campo => `${campo} = ?`).join(', ');
        const valores = campos.map(campo => data[campo]);

        const result = await executeQuery(
            `UPDATE orden_items SET ${columnas} WHERE id = ?`,
            [...valores, id]
        );

        return result.affectedRows > 0;
    }

    static async eliminar(id) {
        const result = await executeQuery('DELETE FROM orden_items WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async eliminarPorOrden(ordenId) {
        const result = await executeQuery('DELETE FROM orden_items WHERE orden_id = ?', [ordenId]);
        return result.affectedRows;
    }
}

module.exports = OrdenItems;