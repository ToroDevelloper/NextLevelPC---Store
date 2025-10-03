const { executeQuery } = require('../config/db');

class Ordenes {

    static async obtenerTodas() {
        try {
            const rows = await executeQuery(`
                SELECT o.*, 
                       u.Nombre as cliente_nombre, 
                       u.Apellido as cliente_apellido,
                       u.Correo as cliente_correo
                FROM ordenes o 
                INNER JOIN usuarios u ON o.cliente_id = u.ID_Usuario 
                ORDER BY o.created_at DESC
            `);
            return rows;
        } catch (error) {
            console.error('Error en Ordenes.obtenerTodas:', error.message);
            throw new Error('Error al obtener órdenes de la base de datos');
        }
    }

    static async obtenerPorId(id) {
        try {
            const [orden] = await executeQuery(`
                SELECT o.*, 
                       u.Nombre as cliente_nombre, 
                       u.Apellido as cliente_apellido,
                       u.Correo as cliente_correo,
                       u.Celular as cliente_celular
                FROM ordenes o 
                INNER JOIN usuarios u ON o.cliente_id = u.ID_Usuario 
                WHERE o.id = ?
            `, [id]);

            return orden || null;
        } catch (error) {
            console.error('Error en Ordenes.obtenerPorId:', error.message);
            throw new Error('Error al obtener la orden');
        }
    }


}