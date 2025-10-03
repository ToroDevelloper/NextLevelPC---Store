const ordenItemsService = require('../services/OrdenItemsService.js');

class OrdenItemsController {
    static async crear(req, res) {
        try {
            const data = req.body;
            const insertId = await ordenItemsService.crear(data);

            res.status(201).json({
                mensaje: 'Item creado exitosamente',
                item_id: insertId
            });
        } catch (error) {
            console.error("Error en crear:", error);
            res.status(500).json({ mensaje: 'Error al crear el item: ' + error.message });
        }
    }

    static async obtenerTodos(req, res) {
        try {
            const items = await ordenItemsService.obtenerTodos();
            res.status(200).json(items);
        } catch (error) {
            console.error("Error en obtenerTodos:", error);
            res.status(500).json({ mensaje: 'Error al obtener todos los items: ' + error.message });
        }
    }

    static async obtenerPorOrden(req, res) {
        try {
            const ordenId = req.params.ordenId;
            const items = await ordenItemsService.obtenerPorOrden(ordenId);
            res.status(200).json(items);
        } catch (error) {
            console.error("Error en obtenerPorOrden:", error);
            res.status(500).json({ mensaje: 'Error al obtener los items de la orden: ' + error.message });
        }
    }

    static async actualizar(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            const actualizado = await ordenItemsService.actualizar(id, data);

            if (!actualizado) {
                return res.status(404).json({ mensaje: 'Item no encontrado' });
            }

            res.status(200).json({ mensaje: 'Item actualizado exitosamente' });
        } catch (error) {
            console.error("Error en actualizar:", error);
            res.status(500).json({ mensaje: 'Error al actualizar el item: ' + error.message });
        }
    }

    static async eliminar(req, res) {
        try {
            const id = req.params.id;
            const eliminado = await ordenItemsService.eliminar(id);

            if (!eliminado) {
                return res.status(404).json({ mensaje: 'Item no encontrado' });
            }

            res.status(200).json({ mensaje: 'Item eliminado exitosamente' });
        } catch (error) {
            console.error("Error en eliminar:", error);
            res.status(500).json({ mensaje: 'Error al eliminar el item: ' + error.message });
        }
    }

}
module.exports = OrdenItemsController;