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
}