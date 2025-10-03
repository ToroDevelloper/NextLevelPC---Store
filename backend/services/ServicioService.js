// services/servicioService.js
const Servicio = require('../models/Servicio');

class ServicioService {
    /**
     * Crear un nuevo servicio
     */
    async crearServicio(data) {
        try {
            // Validar campos requeridos
            if (!data.nombre || data.nombre.trim() === '') {
                throw new Error('El nombre del servicio es requerido');
            }

            if (!data.categoria_id) {
                throw new Error('La categoría es requerida');
            }

            if (data.precio === undefined || data.precio === null || data.precio === '') {
                throw new Error('El precio es requerido');
            }

            // Validar tipo de datos
            const precio = parseFloat(data.precio);
            if (isNaN(precio)) {
                throw new Error('El precio debe ser un número válido');
            }

            if (precio < 0) {
                throw new Error('El precio no puede ser negativo');
            }

            // Validar que la categoría sea de tipo "Servicio"
            const categoriaValida = await Servicio.validarCategoria(data.categoria_id);
            if (!categoriaValida) {
                throw new Error('La categoría especificada no existe o no es de tipo Servicio');
            }

            // Crear el servicio
            const servicioData = {
                nombre: data.nombre.trim(),
                categoria_id: parseInt(data.categoria_id),
                precio: precio
            };

            const servicio = await Servicio.create(servicioData);

            return {
                success: true,
                message: 'Servicio creado exitosamente',
                data: servicio
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Obtener un servicio por ID
     */
    async obtenerServicioPorId(id) {
        try {
            // Validar ID
            if (!id || isNaN(id)) {
                throw new Error('ID de servicio inválido');
            }

            const servicio = await Servicio.findById(id);

            if (!servicio) {
                throw new Error('Servicio no encontrado');
            }

            return {
                success: true,
                data: servicio
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Obtener todos los servicios con filtros opcionales
     */
    async obtenerTodosServicios(filters = {}) {
        try {
            const servicios = await Servicio.findAll(filters);

            return {
                success: true,
                count: servicios.length,
                data: servicios
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Actualizar un servicio existente
     */
    async actualizarServicio(id, data) {
        try {
            // Validar ID
            if (!id || isNaN(id)) {
                throw new Error('ID de servicio inválido');
            }

            // Verificar que el servicio existe
            const existe = await Servicio.exists(id);
            if (!existe) {
                throw new Error('Servicio no encontrado');
            }

            // Validar campos
            if (data.nombre !== undefined && data.nombre.trim() === '') {
                throw new Error('El nombre del servicio no puede estar vacío');
            }

            if (data.precio !== undefined) {
                const precio = parseFloat(data.precio);
                if (isNaN(precio)) {
                    throw new Error('El precio debe ser un número válido');
                }
                if (precio < 0) {
                    throw new Error('El precio no puede ser negativo');
                }
            }

            // Validar categoría si se proporciona
            if (data.categoria_id) {
                const categoriaValida = await Servicio.validarCategoria(data.categoria_id);
                if (!categoriaValida) {
                    throw new Error('La categoría especificada no existe o no es de tipo Servicio');
                }
            }

            // Preparar datos para actualizar
            const servicioData = {
                nombre: data.nombre ? data.nombre.trim() : undefined,
                categoria_id: data.categoria_id ? parseInt(data.categoria_id) : undefined,
                precio: data.precio ? parseFloat(data.precio) : undefined
            };

            // Obtener el servicio actual para mantener los valores no modificados
            const servicioActual = await Servicio.findById(id);

            const datosActualizados = {
                nombre: servicioData.nombre || servicioActual.nombre,
                categoria_id: servicioData.categoria_id || servicioActual.categoria_id,
                precio: servicioData.precio !== undefined ? servicioData.precio : servicioActual.precio
            };

            const servicioActualizado = await Servicio.update(id, datosActualizados);

            return {
                success: true,
                message: 'Servicio actualizado exitosamente',
                data: servicioActualizado
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Eliminar un servicio
     */
    async eliminarServicio(id) {
        try {
            // Validar ID
            if (!id || isNaN(id)) {
                throw new Error('ID de servicio inválido');
            }

            // Verificar que el servicio existe
            const existe = await Servicio.exists(id);
            if (!existe) {
                throw new Error('Servicio no encontrado');
            }

            const eliminado = await Servicio.delete(id);

            if (!eliminado) {
                throw new Error('No se pudo eliminar el servicio');
            }

            return {
                success: true,
                message: 'Servicio eliminado exitosamente'
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new ServicioService();