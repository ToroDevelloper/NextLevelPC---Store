// services/servicioService.js
const Servicio = require('../models/Servicio');

class ServicioService {
    // Obtener todos los servicios
    async getAllServicios() {
        try {
            return await Servicio.findAll();
        } catch (error) {
            throw new Error(`Error al obtener servicios: ${error.message}`);
        }
    }

    // Obtener servicios por tipo
    async getServiciosByTipo(tipo) {
        try {
            // Validar que el tipo sea válido
            if (!['basico', 'avanzado'].includes(tipo)) {
                throw new Error('Tipo de servicio inválido. Use "basico" o "avanzado"');
            }
            return await Servicio.findByTipo(tipo);
        } catch (error) {
            throw new Error(`Error al obtener servicios por tipo: ${error.message}`);
        }
    }

    // Obtener servicio por ID
    async getServicioById(id) {
        try {
            const servicio = await Servicio.findById(id);
            if (!servicio) {
                throw new Error('Servicio no encontrado');
            }
            return servicio;
        } catch (error) {
            throw new Error(`Error al obtener servicio: ${error.message}`);
        }
    }

    // Crear nuevo servicio
    async createServicio(servicioData) {
        try {
            // Validar tipo si se proporciona
            if (servicioData.tipo && !['basico', 'avanzado'].includes(servicioData.tipo)) {
                throw new Error('Tipo de servicio inválido. Use "basico" o "avanzado"');
            }

            // Validar que no exista un servicio con el mismo nombre
            const servicioExistente = await Servicio.findByNombre(servicioData.nombre);
            if (servicioExistente) {
                throw new Error('Ya existe un servicio con ese nombre');
            }

            // Validar precio
            if (servicioData.precio <= 0) {
                throw new Error('El precio debe ser mayor a 0');
            }

            return await Servicio.create(servicioData);
        } catch (error) {
            throw new Error(`Error al crear servicio: ${error.message}`);
        }
    }

    // Actualizar servicio
    async updateServicio(id, servicioData) {
        try {
            // Verificar que el servicio existe
            const servicioExistente = await Servicio.findById(id);
            if (!servicioExistente) {
                throw new Error('Servicio no encontrado');
            }

            // Validar tipo si se proporciona
            if (servicioData.tipo && !['basico', 'avanzado'].includes(servicioData.tipo)) {
                throw new Error('Tipo de servicio inválido. Use "basico" o "avanzado"');
            }

            // Validar que no exista otro servicio con el mismo nombre
            const servicioConMismoNombre = await Servicio.findByNombre(servicioData.nombre, id);
            if (servicioConMismoNombre) {
                throw new Error('Ya existe otro servicio con ese nombre');
            }

            // Validar precio
            if (servicioData.precio && servicioData.precio <= 0) {
                throw new Error('El precio debe ser mayor a 0');
            }

            return await Servicio.update(id, servicioData);
        } catch (error) {
            throw new Error(`Error al actualizar servicio: ${error.message}`);
        }
    }

    // Eliminar servicio
    async deleteServicio(id) {
        try {
            const servicio = await Servicio.findById(id);
            if (!servicio) {
                throw new Error('Servicio no encontrado');
            }

            const eliminado = await Servicio.delete(id);
            if (!eliminado) {
                throw new Error('No se pudo eliminar el servicio');
            }

            return { message: 'Servicio eliminado correctamente' };
        } catch (error) {
            throw new Error(`Error al eliminar servicio: ${error.message}`);
        }
    }
}

module.exports = new ServicioService();