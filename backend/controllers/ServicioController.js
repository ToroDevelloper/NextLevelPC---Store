// controllers/servicioController.js
const servicioService = require('../services/servicioService');

class ServicioController {
    /**
     * POST /api/servicios
     * Crear un nuevo servicio
     */
    async crearServicio(req, res) {
        try {
            const result = await servicioService.crearServicio(req.body);
            res.status(201).json(result);
        } catch (error) {
            console.error('Error en crearServicio:', error.message);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * GET /api/servicios/:id
     * Obtener un servicio por ID
     */
    async obtenerServicio(req, res) {
        try {
            const { id } = req.params;
            const result = await servicioService.obtenerServicioPorId(id);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error en obtenerServicio:', error.message);
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * GET /api/servicios
     * Obtener todos los servicios con filtros opcionales
     * Query params: nombre, categoria_id, minPrecio, maxPrecio
     */
    async obtenerTodosServicios(req, res) {
        try {
            const filters = {
                nombre: req.query.nombre,
                categoria_id: req.query.categoria_id,
                minPrecio: req.query.minPrecio,
                maxPrecio: req.query.maxPrecio
            };

            const result = await servicioService.obtenerTodosServicios(filters);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error en obtenerTodosServicios:', error.message);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * PUT /api/servicios/:id
     * Actualizar un servicio existente
     */
    async actualizarServicio(req, res) {
        try {
            const { id } = req.params;
            const result = await servicioService.actualizarServicio(id, req.body);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error en actualizarServicio:', error.message);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * DELETE /api/servicios/:id
     * Eliminar un servicio
     */
    async eliminarServicio(req, res) {
        try {
            const { id } = req.params;
            const result = await servicioService.eliminarServicio(id);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error en eliminarServicio:', error.message);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new ServicioController();