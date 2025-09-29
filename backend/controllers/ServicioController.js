const servicioService = require('../services/ServicioService'); // Cambiado de services a service

class ServicioController {
    async crearServicio(req, res) {
        try {
            const result = await servicioService.crearServicio(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async obtenerServicio(req, res) {
        try {
            const { id } = req.params;
            const result = await servicioService.obtenerServicioPorId(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async obtenerTodosServicios(req, res) {
        try {
            const filters = {
                tipo: req.query.tipo,
                minPrice: req.query.minPrice,
                maxPrice: req.query.maxPrice
            };

            const result = await servicioService.obtenerTodosServicios(filters);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async actualizarServicio(req, res) {
        try {
            const { id } = req.params;
            const result = await servicioService.actualizarServicio(id, req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async eliminarServicio(req, res) {
        try {
            const { id } = req.params;
            const result = await servicioService.eliminarServicio(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new ServicioController();