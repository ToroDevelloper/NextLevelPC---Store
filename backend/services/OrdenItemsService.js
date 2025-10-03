const OrdenItems = require('../models/OrdenItems');

class OrdenItemsService {
    static async crear(datosItem) {
        try {
            // Validar campos requeridos
            if (!datosItem.orden_id || !datosItem.tipo) {
                throw new Error('Orden ID y tipo son requeridos');
            }

            return await OrdenItems.crear(datosItem);
        } catch (error) {
            throw new Error('Error al crear el item: ' + error.message);
        }
    }

    static async obtenerTodos() {
    return await OrdenItems.obtenerTodos();
}

    static async obtenerPorOrden(ordenId) {
        return await OrdenItems.obtenerPorOrden(ordenId);
    }

    static async actualizar(id, datos) {
        return await OrdenItems.actualizar(id, datos);
    }

    static async eliminar(id) {
        return await OrdenItems.eliminar(id);
    }

    static async eliminarPorOrden(ordenId) {
        return await OrdenItems.eliminarPorOrden(ordenId);
    }

    static async obtenerPorId(id) {
        // Método temporal para evitar errores
        const result = await executeQuery('SELECT * FROM orden_items WHERE id = ?', [id]);
        return result.length > 0 ? result[0] : null;
    }
}

module.exports = OrdenItemsService;