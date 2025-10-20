const ProductosService = require('../services/ProductosService');

class ProductosController {
    static async crearProducto(req, res) {
        try {
            const { nombre, categoria_id, precio_actual, stock, activo } = req.body;

            const productoData = {
                nombre,
                categoria_id,
                precio_actual,
                stock,
                activo
            };

            const nuevoProducto = await ProductosService.crearProducto(productoData);

            res.status(201).json({
                success: true,
                message: 'Producto creado exitosamente',
                data: nuevoProducto
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async obtenerTodosLosProductos(req, res) {
        try {
            const productos = await ProductosService.obtenerTodosLosProductos();

            res.status(200).json({
                success: true,
                data: productos
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async obtenerProductosActivos(req, res) {
        try {
            const productos = await ProductosService.obtenerProductosActivos();

            res.status(200).json({
                success: true,
                data: productos
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async obtenerProductoPorId(req, res) {
        try {
            const { id } = req.params;
            const producto = await ProductosService.obtenerProductoPorId(id);

            res.status(200).json({
                success: true,
                data: producto
            });
        } catch (error) {
            if (error.message === 'Producto no encontrado') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async obtenerProductosPorCategoria(req, res) {
        try {
            const { categoria_id } = req.params;
            const productos = await ProductosService.obtenerProductosPorCategoria(categoria_id);

            res.status(200).json({
                success: true,
                data: productos
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async actualizarProducto(req, res) {
        try {
            const { id } = req.params;
            const productoData = req.body;

            const productoActualizado = await ProductosService.actualizarProducto(id, productoData);

            res.status(200).json({
                success: true,
                message: 'Producto actualizado exitosamente',
                data: productoActualizado
            });
        } catch (error) {
            if (error.message === 'Producto no encontrado') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async actualizarStock(req, res) {
        try {
            const { id } = req.params;
            const { stock } = req.body;

            if (stock === undefined || stock === null) {
                return res.status(400).json({
                    success: false,
                    message: 'El campo stock es requerido'
                });
            }

            const productoActualizado = await ProductosService.actualizarStock(id, stock);

            res.status(200).json({
                success: true,
                message: 'Stock actualizado exitosamente',
                data: productoActualizado
            });
        } catch (error) {
            if (error.message === 'Producto no encontrado') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async eliminarProducto(req, res) {
        try {
            const { id } = req.params;

            const resultado = await ProductosService.eliminarProducto(id);

            res.status(200).json({
                success: true,
                message: resultado.mensaje
            });
        } catch (error) {
            if (error.message === 'Producto no encontrado') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async desactivarProducto(req, res) {
        try {
            const { id } = req.params;

            const productoDesactivado = await ProductosService.desactivarProducto(id);

            res.status(200).json({
                success: true,
                message: 'Producto desactivado exitosamente',
                data: productoDesactivado
            });
        } catch (error) {
            if (error.message === 'Producto no encontrado') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async activarProducto(req, res) {
        try {
            const { id } = req.params;

            const productoActivado = await ProductosService.activarProducto(id);

            res.status(200).json({
                success: true,
                message: 'Producto activado exitosamente',
                data: productoActivado
            });
        } catch (error) {
            if (error.message === 'Producto no encontrado') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    static async obtenerProductosConImagenes(req, res) {
        try {
            const productos = await ProductosService.obtenerProductosConImagenes();
            res.status(200).json({
                success: true,
                data: productos
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = ProductosController;
