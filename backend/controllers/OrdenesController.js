class OrdenController {
    static async crear(req, res) {
        try {
            const data = req.body;
            const insertId = await ordenesService.crear(data);
            const nuevaOrden = await ordenesService.obtenerPorId(insertId);

            res.status(201).json({ mensaje: 'Orden creada exitosamente', orden: nuevaOrden });
        } catch (error) {
            console.error("Error en crear:", error);
            res.status(500).json({ mensaje: 'Error al crear la orden' });
        }
    }

    static async obtenerTodos(req, res) {
        try {
            const ordenes = await ordenesService.obtenerTodos();
            res.status(200).json(ordenes);
        } catch (error) {
            console.error("Error en obtenerTodos:", error);
            res.status(500).json({ mensaje: 'Error al obtener las órdenes' });
        }
    }

     static async obtenerPorId(req, res) {
        try {
            const id = req.params.id;
            const orden = await ordenesService.obtenerPorId(id);

            if (!orden) {
                return res.status(404).json({ mensaje: 'Orden no encontrada' });
            }

            res.status(200).json(orden);
        } catch (error) {
            console.error("Error en obtenerPorId:", error);
            res.status(500).json({ mensaje: 'Error al obtener la orden' });
        }
    }

    static async actualizar(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            const actualizado = await ordenesService.actualizar(id, data);

            if (!actualizado) {
                return res.status(404).json({ mensaje: 'Orden no encontrada' });
            }

            res.status(200).json({ mensaje: 'Orden actualizada exitosamente' });
        } catch (error) {
            console.error("Error en actualizar:", error);
            res.status(500).json({ mensaje: 'Error al actualizar la orden' });
        }
    }

    static async eliminar(req, res) {
        try {
            const id = req.params.id;
            const eliminado = await ordenesService.eliminar(id);

            if (!eliminado) {
                return res.status(404).json({ mensaje: 'Orden no encontrada' });
            }

            res.status(200).json({ mensaje: 'Orden eliminada exitosamente' });
        } catch (error) {
            console.error("Error en eliminar:", error);
            res.status(500).json({ mensaje: 'Error al eliminar la orden' });
        }
    }

    static async obtenerPorCliente(req, res) {
        try {
            const clienteId = req.params.clienteId;
            const ordenes = await ordenesService.obtenerPorCliente(clienteId);
            res.status(200).json(ordenes);
        } catch (error) {
            console.error("Error en obtenerPorCliente:", error);
            res.status(500).json({ mensaje: 'Error al obtener las órdenes del cliente' });
        }
    }



}

