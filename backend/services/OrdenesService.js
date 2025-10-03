const Ordenes = require('../models/Ordenes');

class OrdenesService {
    static async crear(datosOrden) {
        try {
            // Validar campos requeridos
            if (!datosOrden.cliente_id || !datosOrden.tipo) {
                throw new Error('Cliente ID y tipo son requeridos');
            }

            return await Ordenes.crear(datosOrden);
        } catch (error) {
            throw new Error('Error al crear la orden: ' + error.message);
        }
    }

    static async obtenerTodos() {
        return await Ordenes.obtenerTodos();
    }

    static async obtenerPorId(id) {
        return await Ordenes.obtenerPorId(id);
    }

    static async actualizar(id, datos) {
        return await Ordenes.actualizar(id, datos);
    }

    static async eliminar(id) {
        return await Ordenes.eliminar(id);
    }

    static async obtenerPorCliente(clienteId) {
        return await Ordenes.obtenerPorCliente(clienteId);
    }

    static async actualizarTotal(id) {
        return await Ordenes.actualizarTotal(id);
    }
}

module.exports = OrdenesService;