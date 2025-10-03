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


}