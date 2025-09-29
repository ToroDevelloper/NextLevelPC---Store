const Servicio = require('../models/Servicio');

class ServicioService {
    async crearServicio(serviceData) {
        try {
            // Validaciones básicas
            if (!serviceData.tipo || !serviceData.precio) {
                throw new Error('Tipo y precio son campos requeridos');
            }

            if (serviceData.precio < 0) {
                throw new Error('El precio no puede ser negativo');
            }

            const servicio = await Servicio.create(serviceData);
            return {
                success: true,
                data: servicio,
                message: 'Servicio creado exitosamente'
            };
        } catch (error) {
            throw new Error(`Error al crear servicio: ${error.message}`);
        }
    }

    async obtenerServicioPorId(id) {
        try {
            const servicio = await Servicio.findById(id);

            if (!servicio) {
                throw new Error('Servicio no encontrado');
            }

            return {
                success: true,
                data: servicio
            };
        } catch (error) {
            throw new Error(`Error al obtener servicio: ${error.message}`);
        }
    }

    async obtenerTodosServicios(filters = {}) {
        try {
            const servicios = await Servicio.findAll(filters);

            return {
                success: true,
                data: servicios,
                count: servicios.length
            };
        } catch (error) {
            throw new Error(`Error al obtener servicios: ${error.message}`);
        }
    }

    async actualizarServicio(id, serviceData) {
        try {
            // Verificar que el servicio existe
            const servicioExists = await Servicio.exists(id);
            if (!servicioExists) {
                throw new Error('Servicio no encontrado');
            }

            if (serviceData.precio && serviceData.precio < 0) {
                throw new Error('El precio no puede ser negativo');
            }

            const servicioActualizado = await Servicio.update(id, serviceData);

            return {
                success: true,
                data: servicioActualizado,
                message: 'Servicio actualizado exitosamente'
            };
        } catch (error) {
            throw new Error(`Error al actualizar servicio: ${error.message}`);
        }
    }

    async eliminarServicio(id) {
        try {
            // Verificar que el servicio existe
            const servicioExists = await Servicio.exists(id);
            if (!servicioExists) {
                throw new Error('Servicio no encontrado');
            }

            const eliminado = await Servicio.delete(id);

            if (eliminado) {
                return {
                    success: true,
                    message: 'Servicio eliminado exitosamente'
                };
            } else {
                throw new Error('No se pudo eliminar el servicio');
            }
        } catch (error) {
            throw new Error(`Error al eliminar servicio: ${error.message}`);
        }
    }
}

module.exports = new ServicioService();