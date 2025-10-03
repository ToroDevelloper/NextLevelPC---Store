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

    static async crear(ordenData) {
        try {
            const { cliente_id, tipo, total = 0.00 } = ordenData;

            // Generar número de orden único
            const numero_orden = `ORD-${Date.now()}`;

            const result = await executeQuery(
                `INSERT INTO ordenes (cliente_id, tipo, numero_orden, total, estado_orden, estado_pago) 
                 VALUES (?, ?, ?, ?, 'Pendiente', 'Pendiente')`,
                [cliente_id, tipo, numero_orden, total]
            );

            return result.insertId;
        } catch (error) {
            console.error('Error en Ordenes.crear:', error.message);
            throw new Error('Error al crear la orden');
        }
    }

    static async actualizar(id, ordenData) {
        try {
            const camposPermitidos = ['estado_orden', 'estado_pago', 'total'];
            const updates = [];
            const valores = [];

            for (const campo in ordenData) {
                if (camposPermitidos.includes(campo)) {
                    updates.push(`${campo} = ?`);
                    valores.push(ordenData[campo]);
                }
            }

            if (updates.length === 0) {
                throw new Error('No hay campos válidos para actualizar');
            }

            valores.push(id);

            const result = await executeQuery(
                `UPDATE ordenes SET ${updates.join(', ')} WHERE id = ?`,
                valores
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en Ordenes.actualizar:', error.message);
            throw new Error('Error al actualizar la orden: ' + error.message);
        }
    }

    static async eliminar(id) {
        try {
            const result = await executeQuery('DELETE FROM ordenes WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en Ordenes.eliminar:', error.message);
            throw new Error('Error al eliminar la orden');
        }
    }

    static async obtenerPorCliente(clienteId) {
        try {
            const rows = await executeQuery(`
                SELECT o.* 
                FROM ordenes o 
                WHERE o.cliente_id = ? 
                ORDER BY o.created_at DESC
            `, [clienteId]);

            return rows;
        } catch (error) {
            console.error('Error en Ordenes.obtenerPorCliente:', error.message);
            throw new Error('Error al obtener órdenes del cliente');
        }
    }

    static async actualizarTotal(id) {
        try {
            // Calcular total sumando los items
            const [result] = await executeQuery(`
                UPDATE ordenes o
                SET o.total = (
                    SELECT COALESCE(SUM(oi.subtotal), 0) 
                    FROM orden_items oi 
                    WHERE oi.orden_id = o.id
                )
                WHERE o.id = ?
            `, [id]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en Ordenes.actualizarTotal:', error.message);
            throw new Error('Error al actualizar el total de la orden');
        }
    }
}
module.exports = Ordenes;