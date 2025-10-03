const Productos = require('../models/Productos');

class ProductosService {
    static async crearProducto(productoData) {
        try {
            // Validaciones básicas
            if (!productoData.nombre || !productoData.categoria_id || !productoData.precio_actual) {
                throw new Error('Nombre, categoría_id y precio_actual son campos obligatorios');
            }

            if (productoData.precio_actual < 0) {
                throw new Error('El precio no debe ser negativo');
            }

            if (productoData.stock && productoData.stock < 0) {
                throw new Error('El stock no puede ser negativo');
            }

            const productoId = await Productos.crear(productoData);
            return await Productos.obtenerPorId(productoId);
        } catch (error) {
            throw new Error(`Error al crear producto: ${error.message}`);
        }
    }

    static async obtenerTodosLosProductos() {
        try {
            return await Productos.obtenerTodos();
        } catch (error) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    static async obtenerProductosActivos() {
        try {
            return await Productos.obtenerActivos();
        } catch (error) {
            throw new Error(`Error al obtener productos activos: ${error.message}`);
        }
    }

    static async obtenerProductoPorId(id) {
        try {
            if (!id) {
                throw new Error('ID de producto es requerido');
            }

            const producto = await Productos.obtenerPorId(id);

            if (!producto) {
                throw new Error('Producto no encontrado');
            }

            return producto;
        } catch (error) {
            throw new Error(`Error al obtener producto: ${error.message}`);
        }
    }

    static async obtenerProductosPorCategoria(categoria_id) {
        try {
            if (!categoria_id) {
                throw new Error('ID de categoría es requerido');
            }

            return await Productos.obtenerPorCategoria(categoria_id);
        } catch (error) {
            throw new Error(`Error al obtener productos por categoría: ${error.message}`);
        }
    }

    static async actualizarProducto(id, productoData) {
        try {
            if (!id) {
                throw new Error('ID de producto es requerido');
            }

            // Verificar que el producto existe
            const productoExistente = await Productos.obtenerPorId(id);
            if (!productoExistente) {
                throw new Error('Producto no encontrado');
            }

            // Validaciones de datos
            if (productoData.precio_actual && productoData.precio_actual < 0) {
                throw new Error('El precio no puede ser negativo');
            }

            if (productoData.stock && productoData.stock < 0) {
                throw new Error('El stock no puede ser negativo');
            }

            const actualizado = await Productos.actualizar(id, productoData);

            if (!actualizado) {
                throw new Error('No se pudo actualizar el producto');
            }

            return await Productos.obtenerPorId(id);
        } catch (error) {
            throw new Error(`Error al actualizar producto: ${error.message}`);
        }
    }

    static async actualizarStock(id, nuevoStock) {
        try {
            if (!id) {
                throw new Error('ID de producto es requerido');
            }

            if (nuevoStock < 0) {
                throw new Error('El stock no puede ser negativo');
            }

            // Verificar que el producto existe
            const productoExistente = await Productos.obtenerPorId(id);
            if (!productoExistente) {
                throw new Error('Producto no encontrado');
            }

            const actualizado = await Productos.actualizarStock(id, nuevoStock);

            if (!actualizado) {
                throw new Error('No se pudo actualizar el stock');
            }

            return await Productos.obtenerPorId(id);
        } catch (error) {
            throw new Error(`Error al actualizar stock: ${error.message}`);
        }
    }

    static async eliminarProducto(id) {
        try {
            if (!id) {
                throw new Error('ID de producto es requerido');
            }

            // Verificar que el producto existe
            const productoExistente = await Productos.obtenerPorId(id);
            if (!productoExistente) {
                throw new Error('Producto no encontrado');
            }

            const eliminado = await Productos.eliminar(id);

            if (!eliminado) {
                throw new Error('No se pudo eliminar el producto');
            }

            return { mensaje: 'Producto eliminado correctamente' };
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }

    static async desactivarProducto(id) {
        try {
            if (!id) {
                throw new Error('ID de producto es requerido');
            }

            // Verificar que el producto existe
            const productoExistente = await Productos.obtenerPorId(id);
            if (!productoExistente) {
                throw new Error('Producto no encontrado');
            }

            const desactivado = await Productos.desactivar(id);

            if (!desactivado) {
                throw new Error('No se pudo desactivar el producto');
            }

            return await Productos.obtenerPorId(id);
        } catch (error) {
            throw new Error(`Error al desactivar producto: ${error.message}`);
        }
    }

    static async activarProducto(id) {
        try {
            if (!id) {
                throw new Error('ID de producto es requerido');
            }

            // Verificar que el producto existe
            const productoExistente = await Productos.obtenerPorId(id);
            if (!productoExistente) {
                throw new Error('Producto no encontrado');
            }

            const activado = await Productos.activar(id);

            if (!activado) {
                throw new Error('No se pudo activar el producto');
            }

            return await Productos.obtenerPorId(id);
        } catch (error) {
            throw new Error(`Error al activar producto: ${error.message}`);
        }
    }
}

module.exports = ProductosService;