// service/ProductosService.js
const ProductoModel = require('../models/ProductoModel');

class ProductosService {
    static async listarProductos() {
        return await ProductoModel.getAll();
    }

    static async buscarProductoPorId(id) {
        return await ProductoModel.getById(id);
    }

    static async crearProducto(data) {
        return await ProductoModel.create(data);
    }

    static async actualizarProducto(id, data) {
        return await ProductoModel.update(id, data);
    }

    static async eliminarProducto(id) {
        return await ProductoModel.delete(id);
    }
}

module.exports = ProductosService;
