const { executeQuery } = require('../config/db');

class Reembolsos {
  /**
   * Crear un registro de reembolso
   * @param {Object} data - Datos del reembolso
   * @returns {number} ID del reembolso creado
   */
  static async crear(data) {
    const { orden_id, stripe_refund_id, monto, razon, estado = 'completado' } = data;

    // Validaciones básicas
    if (!orden_id) {
      throw new Error('orden_id es requerido');
    }

    if (!stripe_refund_id) {
      throw new Error('stripe_refund_id es requerido');
    }

    if (monto === undefined || monto === null) {
      throw new Error('monto es requerido');
    }

    if (monto <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }

    if (!['pendiente', 'completado', 'fallido'].includes(estado)) {
      throw new Error('Estado inválido');
    }

    const result = await executeQuery(
      `INSERT INTO reembolsos (orden_id, stripe_refund_id, monto, razon, estado) 
       VALUES (?, ?, ?, ?, ?)`,
      [orden_id, stripe_refund_id, monto, razon, estado]
    );

    return result.insertId;
  }

  /**
   * Obtener reembolso por ID
   * @param {number} id - ID del reembolso
   * @returns {Object} Datos del reembolso
   */
  static async obtenerPorId(id) {
    if (!id) {
      throw new Error('ID es requerido');
    }

    const result = await executeQuery(
      `SELECT * FROM reembolsos WHERE id = ?`,
      [id]
    );

    return result.length > 0 ? result[0] : null;
  }

  /**
   * Obtener reembolsos por orden
   * @param {number} ordenId - ID de la orden
   * @returns {Array} Lista de reembolsos
   */
  static async obtenerPorOrden(ordenId) {
    if (!ordenId) {
      throw new Error('ID de orden es requerido');
    }

    return await executeQuery(
      `SELECT * FROM reembolsos WHERE orden_id = ? ORDER BY created_at DESC`,
      [ordenId]
    );
  }

  /**
   * Obtener reembolsos por stripe_refund_id
   * @param {string} stripeRefundId - ID del refund en Stripe
   * @returns {Object} Datos del reembolso
   */
  static async obtenerPorStripeId(stripeRefundId) {
    if (!stripeRefundId) {
      throw new Error('stripe_refund_id es requerido');
    }

    const result = await executeQuery(
      `SELECT * FROM reembolsos WHERE stripe_refund_id = ?`,
      [stripeRefundId]
    );

    return result.length > 0 ? result[0] : null;
  }

  /**
   * Obtener todos los reembolsos con info de orden y cliente
   * @returns {Array} Lista de todos los reembolsos
   */
  static async obtenerTodos() {
    return await executeQuery(
      `SELECT r.*, o.numero_orden, o.total as total_orden, u.nombre as cliente_nombre, u.correo as cliente_correo
       FROM reembolsos r
       JOIN ordenes o ON r.orden_id = o.id
       LEFT JOIN usuarios u ON o.cliente_id = u.id
       ORDER BY r.created_at DESC`
    );
  }

  /**
   * Obtener reembolsos de un cliente
   * @param {number} clienteId - ID del cliente
   * @returns {Array} Lista de reembolsos del cliente
   */
  static async obtenerPorCliente(clienteId) {
    if (!clienteId) {
      throw new Error('ID de cliente es requerido');
    }

    return await executeQuery(
      `SELECT r.* FROM reembolsos r
       JOIN ordenes o ON r.orden_id = o.id
       WHERE o.cliente_id = ? 
       ORDER BY r.created_at DESC`,
      [clienteId]
    );
  }

  /**
   * Actualizar estado del reembolso
   * @param {number} id - ID del reembolso
   * @param {string} estado - Nuevo estado
   * @returns {boolean} Éxito de la operación
   */
  static async actualizarEstado(id, estado) {
    if (!id) {
      throw new Error('ID del reembolso es requerido');
    }

    if (!['pendiente', 'completado', 'fallido'].includes(estado)) {
      throw new Error('Estado inválido');
    }

    // Verificar que existe
    const reembolsoExiste = await this.obtenerPorId(id);
    if (!reembolsoExiste) {
      throw new Error('Reembolso no encontrado');
    }

    const result = await executeQuery(
      `UPDATE reembolsos SET estado = ? WHERE id = ?`,
      [estado, id]
    );

    return result.affectedRows > 0;
  }

  /**
   * Obtener estadísticas de reembolsos
   * @returns {Object} Estadísticas
   */
  static async obtenerEstadisticas() {
    const result = await executeQuery(`
      SELECT 
        COUNT(*) as total_reembolsos,
        SUM(CASE WHEN estado = 'completado' THEN 1 ELSE 0 END) as completados,
        SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
        SUM(CASE WHEN estado = 'fallido' THEN 1 ELSE 0 END) as fallidos,
        SUM(CASE WHEN estado = 'completado' THEN monto ELSE 0 END) as total_monto_reembolsado,
        MIN(created_at) as primer_reembolso,
        MAX(created_at) as ultimo_reembolso
      FROM reembolsos
    `);

    return result.length > 0 ? result[0] : null;
  }

  /**
   * Obtener reembolsos por estado
   * @param {string} estado - Estado a filtrar
   * @returns {Array} Lista de reembolsos
   */
  static async obtenerPorEstado(estado) {
    if (!['pendiente', 'completado', 'fallido'].includes(estado)) {
      throw new Error('Estado inválido');
    }

    return await executeQuery(
      `SELECT r.*, o.numero_orden, u.nombre as cliente_nombre 
       FROM reembolsos r
       JOIN ordenes o ON r.orden_id = o.id
       LEFT JOIN usuarios u ON o.cliente_id = u.id
       WHERE r.estado = ? 
       ORDER BY r.created_at DESC`,
      [estado]
    );
  }

  /**
   * Obtener reembolsos por rango de fechas
   * @param {string} fechaInicio - Fecha inicio (YYYY-MM-DD)
   * @param {string} fechaFin - Fecha fin (YYYY-MM-DD)
   * @returns {Array} Lista de reembolsos en el rango
   */
  static async obtenerPorRangoFechas(fechaInicio, fechaFin) {
    if (!fechaInicio || !fechaFin) {
      throw new Error('Fechas de inicio y fin son requeridas');
    }

    return await executeQuery(
      `SELECT r.*, o.numero_orden, u.nombre as cliente_nombre
       FROM reembolsos r
       JOIN ordenes o ON r.orden_id = o.id
       LEFT JOIN usuarios u ON o.cliente_id = u.id
       WHERE DATE(r.created_at) BETWEEN ? AND ?
       ORDER BY r.created_at DESC`,
      [fechaInicio, fechaFin]
    );
  }

  /**
   * Eliminar/Anular un reembolso (cambiar a fallido)
   * @param {number} id - ID del reembolso
   * @returns {boolean} Éxito de la operación
   */
  static async anular(id) {
    if (!id) {
      throw new Error('ID del reembolso es requerido');
    }

    // Verificar que existe y está completado
    const reembolso = await this.obtenerPorId(id);
    if (!reembolso) {
      throw new Error('Reembolso no encontrado');
    }

    if (reembolso.estado !== 'completado') {
      throw new Error('Solo se pueden anular reembolsos completados');
    }

    return await this.actualizarEstado(id, 'fallido');
  }
}

module.exports = Reembolsos;
