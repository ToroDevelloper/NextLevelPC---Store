const CitaServicio = require('../models/CitaServicio');

class CitaServicioService {
    async createCita(citaData) {
        // Aquí se podrían añadir validaciones de negocio
        if (!citaData.email) {
            throw new Error('El correo electrónico es obligatorio.');
        }
        // ... más validaciones

        return await CitaServicio.create(citaData);
    }
}

module.exports = new CitaServicioService();

