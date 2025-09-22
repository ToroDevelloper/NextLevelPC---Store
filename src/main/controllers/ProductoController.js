const ProductoService = require('../services/productoService');

class ProductoController {
    static async obtenerTodos(req, res) {
        try {
            const { soloActivos } = req.query;
            let productos;

            if (soloActivos === 'true') {
                productos = await ProductoService.obtenerProductosActivos();
            } else {
                productos = await ProductoService.obtenerTodosLosProductos();
            }

            res.json({
                success: true,
                data: productos,
                message: 'Productos obtenidos correctamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            const producto = await ProductoService.obtenerProductoPorId(id);
            res.json({
                success: true,
                data: producto,
                message: 'Producto obtenido correctamente'
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    static async crear(req, res) {
        try {
            const productoData = req.body;

            if (!productoData.Nombre) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre del producto es requerido'
                });
            }

            const nuevoProductoId = await ProductoService.crearProducto(productoData);
            res.status(201).json({
                success: true,
                data: { id: nuevoProductoId },
                message: 'Producto creado correctamente'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async actualizar(req, res) {
        try {
            const { id } = req.params;
            const datosActualizados = req.body;

            if (Object.keys(datosActualizados).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No se proporcionaron datos para actualizar'
                });
            }

            const productoActualizado = await ProductoService.actualizarProducto(id, datosActualizados);
            res.json({
                success: true,
                data: productoActualizado,
                message: 'Producto actualizado correctamente'
            });
        } catch (error) {
            const statusCode = error.message.includes('no encontrado') ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    static async eliminar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await ProductoService.eliminarProducto(id);
            res.json({
                success: true,
                data: resultado,
                message: 'Producto eliminado correctamente'
            });
        } catch (error) {
            const statusCode = error.message.includes('no encontrado') ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    static async obtenerPorCategoria(req, res) {
        try {
            const { categoriaId } = req.params;
            const productos = await ProductoService.obtenerProductosPorCategoria(categoriaId);
            res.json({
                success: true,
                data: productos,
                message: 'Productos por categoría obtenidos correctamente'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async buscar(req, res) {
        try {
            const { q } = req.query;

            if (!q) {
                return res.status(400).json({
                    success: false,
                    message: 'Parámetro de búsqueda (q) requerido'
                });
            }

            const productos = await ProductoService.buscarProductos(q);
            res.json({
                success: true,
                data: productos,
                message: 'Búsqueda completada correctamente'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async desactivar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await ProductoService.desactivarProducto(id);
            res.json({
                success: true,
                data: resultado,
                message: 'Producto desactivado correctamente'
            });
        } catch (error) {
            const statusCode = error.message.includes('no encontrado') ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    static async activar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await ProductoService.activarProducto(id);
            res.json({
                success: true,
                data: resultado,
                message: 'Producto activado correctamente'
            });
        } catch (error) {
            const statusCode = error.message.includes('no encontrado') ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = ProductoController;