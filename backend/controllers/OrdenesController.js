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



}

