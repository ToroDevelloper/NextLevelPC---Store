const { executeQuery } = require('../config/db');

class OrdenItems {

    static async obtenerPorOrden(ordenId) {
        try {
            const rows = await executeQuery(`
                SELECT oi.*,
                       p.Nombres as producto_nombre,
                       s.nombre as servicio_nombre
                FROM orden_items oi 
                LEFT JOIN producto p ON oi.producto_id = p.ID_Producto 
                LEFT JOIN servicios s ON oi.servicio_id = s.ID_Servicio 
                WHERE oi.orden_id = ?
                ORDER BY oi.id
            `, [ordenId]);
            
            return rows;
        } catch (error) {
            console.error('Error en OrdenItems.obtenerPorOrden:', error.message);
            throw new Error('Error al obtener items de la orden');
        }
    }

    static async crear(itemData) {
        try {
            const { 
                orden_id, 
                tipo, 
                producto_id, 
                servicio_id, 
                descripcion, 
                cantidad = 1, 
                precio_unitario, 
                subtotal 
            } = itemData;

            // Calcular subtotal si no se proporciona
            const subtotalCalculado = subtotal || (precio_unitario * cantidad);

            const result = await executeQuery(
                `INSERT INTO orden_items 
                 (orden_id, tipo, producto_id, servicio_id, descripcion, cantidad, precio_unitario, subtotal) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [orden_id, tipo, producto_id, servicio_id, descripcion, cantidad, precio_unitario, subtotalCalculado]
            );
            
            return result.insertId;
        } catch (error) {
            console.error('Error en OrdenItems.crear:', error.message);
            throw new Error('Error al crear el item de orden');
        }
    }


    static async eliminarPorOrden(ordenId) {
        try {
            const result = await executeQuery('DELETE FROM orden_items WHERE orden_id = ?', [ordenId]);
            return result.affectedRows;
        } catch (error) {
            console.error('Error en OrdenItems.eliminarPorOrden:', error.message);
            throw new Error('Error al eliminar items de la orden');
        }
    }


}