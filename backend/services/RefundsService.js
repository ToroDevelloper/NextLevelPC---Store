const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const OrdenesService = require('./OrdenesService');
const Reembolsos = require('../models/Reembolsos');

class RefundsService {

  /**
   * Procesa un reembolso de una orden pagada
   * @param {number} ordenId - ID de la orden a reembolsar
   * @param {number} monto - Monto a reembolsar (opcional, si no se proporciona reembolsa el total)
   * @param {string} razon - Razón del reembolso
   * @returns {object} Información del reembolso procesado
   */
  static async procesarReembolso(ordenId, monto = null, razon = 'Sin especificar') {
    try {
      // Validar que la orden existe
      const orden = await OrdenesService.obtenerPorId(ordenId);
      if (!orden) {
        throw new Error('Orden no encontrada');
      }

      // Validar que la orden está pagada
      if (orden.estado_pago !== 'pagado') {
        throw new Error(`La orden no puede ser reembolsada. Estado actual: ${orden.estado_pago}`);
      }

      // Validar que existe el payment_intent_id en Stripe
      if (!orden.stripe_payment_intent_id) {
        throw new Error('No hay registro de pago en Stripe para esta orden');
      }

      // Determinar monto a reembolsar
      const montoReembolso = monto || orden.total;
      const montoEnCentavos = Math.round(montoReembolso * 100);

      // Validar monto
      if (montoEnCentavos <= 0) {
        throw new Error('El monto debe ser mayor a 0');
      }

      if (montoEnCentavos > Math.round(orden.total * 100)) {
        throw new Error(`El monto del reembolso no puede ser mayor al total de la orden (${orden.total})`);
      }

      // Procesar reembolso en Stripe
      console.log(`Procesando reembolso de ${montoReembolso} para PaymentIntent: ${orden.stripe_payment_intent_id}`);
      
      const refund = await stripe.refunds.create({
        payment_intent: orden.stripe_payment_intent_id,
        amount: montoEnCentavos,
        metadata: {
          orden_id: ordenId.toString(),
          numero_orden: orden.numero_orden,
          razon: razon.slice(0, 500) // Limitar a 500 caracteres
        }
      });

      console.log('Reembolso exitoso en Stripe:', refund.id);

      // Guardar registro del reembolso en BD usando el modelo
      const reembolsoId = await Reembolsos.crear({
        orden_id: ordenId,
        stripe_refund_id: refund.id,
        monto: montoReembolso,
        razon: razon,
        estado: 'completado'
      });

      // Actualizar estado de pago de la orden
      await OrdenesService.actualizar(ordenId, {
        estado_pago: 'reembolsado',
        estado_orden: 'cancelada'
      });

      console.log('Orden actualizada a estado reembolsado');

      return {
        success: true,
        reembolsoId: refund.id,
        ordenId: ordenId,
        numeroOrden: orden.numero_orden,
        monto: montoReembolso,
        razon: razon,
        fecha: new Date(),
        mensaje: `Reembolso de $${montoReembolso.toLocaleString('es-CO', {style: 'currency', currency: 'COP', minimumFractionDigits: 0})} procesado exitosamente`
      };

    } catch (error) {
      console.error('Error procesando reembolso:', error);
      throw new Error('Error al procesar reembolso: ' + error.message);
    }
  }

  /**
   * Obtiene el historial de reembolsos de una orden
   * @param {number} ordenId - ID de la orden
   * @returns {array} Lista de reembolsos
   */
  static async obtenerReembolsosPorOrden(ordenId) {
    try {
      if (!ordenId) {
        throw new Error('ID de orden es requerido');
      }

      return await Reembolsos.obtenerPorOrden(ordenId);
    } catch (error) {
      throw new Error('Error al obtener reembolsos: ' + error.message);
    }
  }

  /**
   * Obtiene todos los reembolsos
   * @returns {array} Lista de todos los reembolsos
   */
  static async obtenerTodos() {
    try {
      return await Reembolsos.obtenerTodos();
    } catch (error) {
      throw new Error('Error al obtener reembolsos: ' + error.message);
    }
  }

  /**
   * Obtiene los reembolsos de un cliente
   * @param {number} clienteId - ID del cliente
   * @returns {array} Lista de reembolsos del cliente
   */
  static async obtenerReembolsosPorCliente(clienteId) {
    try {
      if (!clienteId) {
        throw new Error('ID de cliente es requerido');
      }

      return await Reembolsos.obtenerPorCliente(clienteId);
    } catch (error) {
      throw new Error('Error al obtener reembolsos del cliente: ' + error.message);
    }
  }

  /**
   * Obtiene estadísticas de reembolsos
   * @returns {object} Estadísticas de reembolsos
   */
  static async obtenerEstadisticas() {
    try {
      return await Reembolsos.obtenerEstadisticas();
    } catch (error) {
      throw new Error('Error al obtener estadísticas: ' + error.message);
    }
  }

  /**
   * Obtiene reembolsos por estado
   * @param {string} estado - Estado a filtrar
   * @returns {array} Lista de reembolsos
   */
  static async obtenerPorEstado(estado) {
    try {
      return await Reembolsos.obtenerPorEstado(estado);
    } catch (error) {
      throw new Error('Error al obtener reembolsos: ' + error.message);
    }
  }

  /**
   * Obtiene reembolsos por rango de fechas
   * @param {string} fechaInicio - Fecha inicio
   * @param {string} fechaFin - Fecha fin
   * @returns {array} Lista de reembolsos
   */
  static async obtenerPorRangoFechas(fechaInicio, fechaFin) {
    try {
      return await Reembolsos.obtenerPorRangoFechas(fechaInicio, fechaFin);
    } catch (error) {
      throw new Error('Error al obtener reembolsos: ' + error.message);
    }
  }

  /**
   * Obtiene un reembolso específico por ID
   * @param {number} id - ID del reembolso
   * @returns {object} Datos del reembolso
   */
  static async obtenerPorId(id) {
    try {
      return await Reembolsos.obtenerPorId(id);
    } catch (error) {
      throw new Error('Error al obtener reembolso: ' + error.message);
    }
  }

  /**
   * Actualiza el estado de un reembolso
   * @param {number} id - ID del reembolso
   * @param {string} estado - Nuevo estado
   * @returns {boolean} Éxito de la operación
   */
  static async actualizarEstado(id, estado) {
    try {
      return await Reembolsos.actualizarEstado(id, estado);
    } catch (error) {
      throw new Error('Error al actualizar reembolso: ' + error.message);
    }
  }

  /**
   * Anula un reembolso (marcar como fallido)
   * @param {number} id - ID del reembolso
   * @returns {boolean} Éxito de la operación
   */
  static async anularReembolso(id) {
    try {
      return await Reembolsos.anular(id);
    } catch (error) {
      throw new Error('Error al anular reembolso: ' + error.message);
    }
  }
}

module.exports = RefundsService;
