const { executeQuery } = require('../config/db');

class Ordenes {
    static async crear(data) {
        const { cliente_id, tipo, total = 0.00 } = data;
        const numero_orden = `ORD-${Date.now()}`;

        const result = await executeQuery(
            `INSERT INTO ordenes (cliente_id, tipo, numero_orden, total, estado_orden, estado_pago) 
             VALUES (?, ?, ?, ?, 'Pendiente', 'Pendiente')`,
            [cliente_id, tipo, numero_orden, total]
        );

        return result.insertId;
    }

    static async obtenerTodos() {
        return await executeQuery(`
            SELECT o.*, 
                   u.nombre as cliente_nombre, 
                   u.apellido as cliente_apellido,
                   u.correo as cliente_correo
            FROM ordenes o 
            INNER JOIN usuarios u ON o.cliente_id = u.id 
            ORDER BY o.created_at DESC
        `);
    }

    static async obtenerPorId(id) {
        const result = await executeQuery(`
            SELECT o.*, 
                   u.nombre as cliente_nombre, 
                   u.apellido as cliente_apellido,
                   u.correo as cliente_correo
            FROM ordenes o 
            INNER JOIN usuarios u ON o.cliente_id = u.id 
            WHERE o.id = ?
        `, [id]);
        
        return result.length > 0 ? result[0] : null;
    }

    static async actualizar(id, data) {
        // Solo campos permitidos para seguridad
        const camposPermitidos = ['estado_orden', 'estado_pago', 'total', 'tipo'];
        const campos = Object.keys(data).filter(campo => camposPermitidos.includes(campo));
        
        if (campos.length === 0) return false;

        const columnas = campos.map(campo => `${campo} = ?`).join(', ');
        const valores = campos.map(campo => data[campo]);

        const result = await executeQuery(
            `UPDATE ordenes SET ${columnas} WHERE id = ?`,
            [...valores, id]
        );

        return result.affectedRows > 0;
    }

    static async eliminar(id) {
        const result = await executeQuery('DELETE FROM ordenes WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async obtenerPorCliente(clienteId) {
        return await executeQuery(`
            SELECT o.* 
            FROM ordenes o 
            WHERE o.cliente_id = ? 
            ORDER BY o.created_at DESC
        `, [clienteId]);
    }
}

module.exports = Ordenes;