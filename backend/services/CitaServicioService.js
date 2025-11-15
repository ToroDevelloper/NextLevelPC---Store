const CitaServicio = require('../models/CitaServicio');

class CitaServicioService {
   static async createCita(citaData) {
        // Aquí se podrían añadir validaciones de negocio
        if (!citaData.email) {
            throw new Error('El correo electrónico es obligatorio.');
        }
        // ... más validaciones

        return await CitaServicio.create(citaData);
    }

   static async getAllCitas() {
        return await CitaServicio.findAll();
    }

   static async updateCitaStatus(id, estado) {
        const estadosValidos = ['pendiente', 'confirmada', 'cancelada', 'completada'];
        if (!estadosValidos.includes(estado)) {
            throw new Error('Estado no válido.');
        }
        return await CitaServicio.updateStatus(id, estado);
    }
}

module.exports = CitaServicioService;
