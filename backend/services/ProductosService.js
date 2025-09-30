const Productos = require('../models/Productos')

class ProductosService {
    static async obtenerTodos(filtros = {}) {
        try {
            const { incluirInactivos = false, categoria_id, buscar } = filtros

            if (categoria_id) {
                return await Productos.obtenerPorCategoria(categoria_id)
            }

            if (buscar) {
                return await Productos.buscarPorNombre(buscar)
            }

             if (incluirInactivos) {
                return await Productos.obtenerTodosConInactivos()
            }

            return await Productos.obtenerTodos()
        } catch (error) {
            throw new Error(`Error al obtener productos: ${error.message}`)
        }
    }

    static async obtenerPorId(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('ID de producto inválido')
            }

            const producto = await Productos.obtenerPorId(id)
            if (!producto) {
                throw new Error('Producto no encontrado')
            }

            return producto
        } catch (error) {
            throw new Error(`Error al obtener producto: ${error.message}`)
        }
    }

    static async obtenerConCategoria(id = null) {
        try {
            return await Productos.obtenerConCategoria(id)
        } catch (error) {
            throw new Error(`Error al obtener producto con categoría: ${error.message}`)
        }
    }

    static async crear(productoData) {
        try {
            // Validaciones requeridas
            if (!productoData.nombre || !productoData.nombre.trim()) {
                throw new Error('El nombre del producto es requerido')
            }

            if (!productoData.categoria_id || isNaN(productoData.categoria_id)) {
                throw new Error('La categoría es requerida y debe ser un número válido')
            }

            if (!productoData.precio_actual || isNaN(productoData.precio_actual) || productoData.precio_actual < 0) {
                throw new Error('El precio actual es requerido y debe ser un número positivo')
            }

            // Validar SKU único si se proporciona
            if (productoData.sku) {
                const productoExistente = await Productos.obtenerPorSku(productoData.sku)
                if (productoExistente) {
                    throw new Error('El SKU ya está en uso por otro producto')
                }
            }

            // Validar y formatear campos JSON
            if (productoData.imagenes && typeof productoData.imagenes !== 'object') {
                throw new Error('El campo imagenes debe ser un objeto JSON válido')
            }

            if (productoData.atributos && typeof productoData.atributos !== 'object') {
                throw new Error('El campo atributos debe ser un objeto JSON válido')
            }

            // Valores por defecto
            const datosProducto = {
                sku: productoData.sku || null,
                nombre: productoData.nombre.trim(),
                marca: productoData.marca || null,
                modelo: productoData.modelo || null,
                categoria_id: parseInt(productoData.categoria_id),
                descripcion: productoData.descripcion || '',
                imagenes: productoData.imagenes || [],
                atributos: productoData.atributos || {},
                precio_actual: parseFloat(productoData.precio_actual),
                impuesto_porcentaje: productoData.impuesto_porcentaje ? parseFloat(productoData.impuesto_porcentaje) : 19.00,
                garantia: productoData.garantia || null,
                activo: productoData.activo !== undefined ? Boolean(productoData.activo) : true
            }

            const productoId = await Productos.crear(datosProducto)
            return await Productos.obtenerPorId(productoId)

        } catch (error) {
            throw new Error(`Error al crear producto: ${error.message}`)
        }
    }

    static async actualizar(id, productoData) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('ID de producto inválido')
            }

            // Verificar que el producto existe
            const productoExistente = await Productos.obtenerPorId(id)
            if (!productoExistente) {
                throw new Error('Producto no encontrado')
            }

            // Validar SKU único si se está actualizando
            if (productoData.sku && productoData.sku !== productoExistente.sku) {
                const skuEnUso = await Productos.skuEnUsoPorOtroProducto(productoData.sku, id)
                if (skuEnUso) {
                    throw new Error('El SKU ya está en uso por otro producto')
                }
            }

            // Validar categoría si se está actualizando
            if (productoData.categoria_id && isNaN(productoData.categoria_id)) {
                throw new Error('La categoría debe ser un número válido')
            }

            // Validar precio si se está actualizando
            if (productoData.precio_actual && (isNaN(productoData.precio_actual) || productoData.precio_actual < 0)) {
                throw new Error('El precio actual debe ser un número positivo')
            }

            // Preparar datos para actualización
            const datosActualizacion = {}
            const camposPermitidos = ['sku', 'nombre', 'marca', 'modelo', 'categoria_id', 'descripcion', 'imagenes', 'atributos', 'precio_actual', 'impuesto_porcentaje', 'garantia', 'activo']

            camposPermitidos.forEach(campo => {
                if (productoData[campo] !== undefined) {
                    if (campo === 'categoria_id') {
                        datosActualizacion[campo] = parseInt(productoData[campo])
                    } else if (campo === 'precio_actual' || campo === 'impuesto_porcentaje') {
                        datosActualizacion[campo] = parseFloat(productoData[campo])
                    } else if (campo === 'activo') {
                        datosActualizacion[campo] = Boolean(productoData[campo])
                    } else if (campo === 'nombre' && productoData[campo]) {
                        datosActualizacion[campo] = productoData[campo].trim()
                    } else {
                        datosActualizacion[campo] = productoData[campo]
                    }
                }
            })

            // Validar campos JSON
            if (datosActualizacion.imagenes && typeof datosActualizacion.imagenes !== 'object') {
                throw new Error('El campo imagenes debe ser un objeto JSON válido')
            }

            if (datosActualizacion.atributos && typeof datosActualizacion.atributos !== 'object') {
                throw new Error('El campo atributos debe ser un objeto JSON válido')
            }

            if (Object.keys(datosActualizacion).length === 0) {
                throw new Error('No se proporcionaron datos para actualizar')
            }

            const actualizado = await Productos.actualizar(id, datosActualizacion)
            if (!actualizado) {
                throw new Error('No se pudo actualizar el producto')
            }

            return await Productos.obtenerPorId(id)

        } catch (error) {
            throw new Error(`Error al actualizar producto: ${error.message}`)
        }
    }

    static async eliminar(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('ID de producto inválido')
            }

            const productoExistente = await Productos.obtenerPorId(id)
            if (!productoExistente) {
                throw new Error('Producto no encontrado')
            }

            const eliminado = await Productos.eliminar(id)
            if (!eliminado) {
                throw new Error('No se pudo eliminar el producto')
            }

            return { message: 'Producto eliminado correctamente' }

        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`)
        }
    }

    static async activar(id) {
        try {
            if (!id || isNaN(id)) {
                throw new Error('ID de producto inválido')
            }

            const productoExistente = await Productos.obtenerPorId(id)
            if (!productoExistente) {
                throw new Error('Producto no encontrado')
            }

            const activado = await Productos.activar(id)
            if (!activado) {
                throw new Error('No se pudo activar el producto')
            }

            return await Productos.obtenerPorId(id)

        } catch (error) {
            throw new Error(`Error al activar producto: ${error.message}`)
        }
    }

    static async validarDatosProducto(productoData) {
        const errores = []

        if (!productoData.nombre || !productoData.nombre.trim()) {
            errores.push('El nombre del producto es requerido')
        }

        if (!productoData.categoria_id || isNaN(productoData.categoria_id)) {
            errores.push('La categoría es requerida y debe ser un número válido')
        }

        if (!productoData.precio_actual || isNaN(productoData.precio_actual) || productoData.precio_actual < 0) {
            errores.push('El precio actual es requerido y debe ser un número positivo')
        }

        if (productoData.imagenes && typeof productoData.imagenes !== 'object') {
            errores.push('El campo imagenes debe ser un objeto JSON válido')
        }

        if (productoData.atributos && typeof productoData.atributos !== 'object') {
            errores.push('El campo atributos debe ser un objeto JSON válido')
        }

        return errores
    }
}

module.exports = ProductosService