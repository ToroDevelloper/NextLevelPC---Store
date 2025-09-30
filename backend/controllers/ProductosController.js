const ProductosService = require('../services/ProductosService');

class ProductosController {
    static async obtenerTodos(req, res) {
        try {
            const productos = await ProductosService.obtenerTodos(req.query);
            res.json({
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

    static async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            const producto = await ProductosService.obtenerPorId(id);

            if (!producto) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            res.json({
                success: true,
                data: producto
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async crear(req, res) {
        try {
            const productoData = req.body;
            const nuevoProducto = await ProductosService.crear(productoData);

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

    static async actualizar(req, res) {
        try {
            const { id } = req.params;
            const productoData = req.body;

            const productoActualizado = await ProductosService.actualizar(id, productoData);

            res.json({
                success: true,
                message: 'Producto actualizado exitosamente',
                data: productoActualizado
            });
        } catch (error) {
            if (error.message.includes('no encontrado')) {
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

    static async eliminar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await ProductosService.eliminar(id);

            res.json({
                success: true,
                message: 'Producto eliminado exitosamente',
                data: resultado
            });
        } catch (error) {
            if (error.message.includes('no encontrado')) {
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
}

module.exports = ProductosController;