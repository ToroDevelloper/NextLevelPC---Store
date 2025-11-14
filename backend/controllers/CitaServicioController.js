const citaServicioService = require('../services/CitaServicioService');

class CitaServicioController {
    async create(req, res) {
        try {
            const cita = await citaServicioService.createCita(req.body);
            res.status(201).json({
                success: true,
                message: 'Cita creada exitosamente.',
                data: cita
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al crear la cita.',
                error: error.message
            });
        }
    }
}

module.exports = new CitaServicioController();



