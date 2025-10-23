const ProductosService = require('../services/ProductosService');

class ProductosController {
    static async crearProducto(req, res) {
        try {
            const data = req.body;
            const nuevoProducto = await ProductosService.crearProducto(data);

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

    // Agregar este método al final de la clase ProductosController en backend/controllers/ProductosController.js

    static async obtenerProductosDestacados(req, res) {
        try {
            const limite = req.query.limite || 6;
            const productos = await ProductosService.obtenerProductosDestacados(parseInt(limite));

            res.status(200).json({
                success: true,
                data: productos,
                count: productos.length
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
