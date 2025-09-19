const ProductoModel = require('../models/ProductoModel');

const ProductosController = {
    // Obtener todos los productos
    async getProductos(req, res) {
        try {
            const productos = await ProductoModel.getAll();
            res.json(productos);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).json({ mensaje: 'Error al obtener productos', error });
        }
    },

    // Obtener producto por ID
    async getProductoById(req, res) {
        try {
            const { id } = req.params;
            const producto = await ProductoModel.getById(id);
            if (!producto) {
                return res.status(404).json({ mensaje: 'Producto no encontrado' });
            }
            res.json(producto);
        } catch (error) {
            console.error('Error al obtener producto:', error);
            res.status(500).json({ mensaje: 'Error al obtener producto', error });
        }
    },

    // Crear producto
    async createProducto(req, res) {
        try {
            const data = req.body;
            if (!data.nombre || !data.categoria_id) {
                return res.status(400).json({ mensaje: 'El nombre y la categoría son obligatorios' });
            }

            const insertId = await ProductoModel.create(data);
            res.status(201).json({ mensaje: 'Producto creado con éxito', id: insertId });
        } catch (error) {
            console.error('Error al crear producto:', error);
            res.status(500).json({ mensaje: 'Error al crear producto', error });
        }
    },

    // Actualizar producto
    async updateProducto(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const result = await ProductoModel.update(id, data);

            if (result.affectedRows === 0) {
                return res.status(404).json({ mensaje: 'Producto no encontrado' });
            }

            res.json({ mensaje: 'Producto actualizado con éxito' });
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            res.status(500).json({ mensaje: 'Error al actualizar producto', error });
        }
    },

    // Eliminar producto
    async deleteProducto(req, res) {
        try {
            const { id } = req.params;
            const result = await ProductoModel.delete(id);

            if (result.affectedRows === 0) {
                return res.status(404).json({ mensaje: 'Producto no encontrado' });
            }

            res.json({ mensaje: 'Producto eliminado con éxito' });
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            res.status(500).json({ mensaje: 'Error al eliminar producto', error });
        }
    }
};

module.exports = ProductosController;
