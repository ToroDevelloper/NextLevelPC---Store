const Productos = require('../models/Productos');

class ProductoService {
    static async obtenerTodosLosProductos() {
        try {
            return await Productos.obtenerTodos();
        } catch (error) {
            throw new Error('Error al obtener los productos: ' + error.message);
        }
    }

    static async obtenerProductosActivos() {
        try {
            return await Productos.obtenerActivos();
        } catch (error) {
            throw new Error('Error al obtener productos activos: ' + error.message);
        }
    }

    static async obtenerProductoPorId(id) {
        try {
            const producto = await Productos.obtenerPorId(id);
            if (!producto) {
                throw new Error('Producto no encontrado');
            }
            return producto;
        } catch (error) {
            throw new Error('Error al obtener el producto: ' + error.message);
        }
    }

    static async crearProducto(datosProducto) {
        try {
            // Validar campos requeridos
            if (!datosProducto.Nombre) {
                throw new Error('El nombre del producto es requerido');
            }
            if (!datosProducto.Categoria_ID) {
                throw new Error('La categoría es requerida');
            }
            if (!datosProducto.Precio_Actual || datosProducto.Precio_Actual < 0) {
                throw new Error('El precio actual es requerido y debe ser mayor o igual a 0');
            }

            // Verificar si el SKU ya existe
            if (datosProducto.SKU) {
                const skuExistente = await Productos.obtenerPorSKU(datosProducto.SKU);
                if (skuExistente) {
                    throw new Error('Ya existe un producto con ese SKU');
                }
            }

            // Procesar campos JSON
            const productoData = {
                ...datosProducto,
                Imagenes: datosProducto.Imagenes || [],
                Atributos: datosProducto.Atributos || {},
                Impuestos: datosProducto.Impuestos || []
            };

            return await Productos.crear(productoData);
        } catch (error) {
            throw new Error('Error al crear el producto: ' + error.message);
        }
    }

    static async actualizarProducto(id, datosActualizados) {
        try {
            // Verificar si el producto existe
            const productoExistente = await Productos.obtenerPorId(id);
            if (!productoExistente) {
                throw new Error('Producto no encontrado');
            }

            // Si se está actualizando el SKU, verificar que no esté en uso
            if (datosActualizados.SKU && datosActualizados.SKU !== productoExistente.sku) {
                const skuEnUso = await Productos.skuEnUsoPorOtroProducto(datosActualizados.SKU, id);
                if (skuEnUso) {
                    throw new Error('Ya existe otro producto con ese SKU');
                }
            }

            const actualizado = await Productos.actualizar(id, datosActualizados);
            if (!actualizado) {
                throw new Error('No se pudo actualizar el producto');
            }

            return await Productos.obtenerPorId(id);
        } catch (error) {
            throw new Error('Error al actualizar el producto: ' + error.message);
        }
    }

    static async eliminarProducto(id) {
        try {
            // Verificar si el producto existe
            const productoExistente = await Productos.obtenerPorId(id);
            if (!productoExistente) {
                throw new Error('Producto no encontrado');
            }

            // En lugar de eliminar, podríamos desactivar el producto
            // await Productos.actualizar(id, { Activo: 0 });

            const eliminado = await Productos.eliminar(id);
            if (!eliminado) {
                throw new Error('No se pudo eliminar el producto');
            }

            return { message: 'Producto eliminado correctamente' };
        } catch (error) {
            throw new Error('Error al eliminar el producto: ' + error.message);
        }
    }

    static async obtenerProductosPorCategoria(categoriaId) {
        try {
            return await Productos.obtenerPorCategoria(categoriaId);
        } catch (error) {
            throw new Error('Error al obtener productos por categoría: ' + error.message);
        }
    }

    static async buscarProductos(termino) {
        try {
            if (!termino || termino.trim() === '') {
                throw new Error('Término de búsqueda requerido');
            }
            return await Productos.buscarProductos(termino.trim());
        } catch (error) {
            throw new Error('Error al buscar productos: ' + error.message);
        }
    }

    static async desactivarProducto(id) {
        try {
            const productoExistente = await Productos.obtenerPorId(id);
            if (!productoExistente) {
                throw new Error('Producto no encontrado');
            }

            const actualizado = await Productos.actualizar(id, { Activo: 0 });
            if (!actualizado) {
                throw new Error('No se pudo desactivar el producto');
            }

            return { message: 'Producto desactivado correctamente' };
        } catch (error) {
            throw new Error('Error al desactivar el producto: ' + error.message);
        }
    }

    static async activarProducto(id) {
        try {
            const productoExistente = await Productos.obtenerPorId(id);
            if (!productoExistente) {
                throw new Error('Producto no encontrado');
            }

            const actualizado = await Productos.actualizar(id, { Activo: 1 });
            if (!actualizado) {
                throw new Error('No se pudo activar el producto');
            }

            return { message: 'Producto activado correctamente' };
        } catch (error) {
            throw new Error('Error al activar el producto: ' + error.message);
        }
    }
}

module.exports = ProductoService;