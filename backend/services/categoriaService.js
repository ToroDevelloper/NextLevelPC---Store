const Categoria = require('../models/Categoria');
const { db } = require('../config/db');

class CategoriaService {
    static async getAllCategorias() {
        try {
            return await Categoria.findAll();
        } catch (error) {
            throw new Error('Error al obtener categorías: ' + error.message);
        }
    }

   static async getCategoriasProductos() {
    try {
        return await Categoria.findAllProductos();
    } catch (error) {
        throw new Error(error.message);
    }
}

  static  async getCategoriaById(id) {
        try {
            const categoria = await Categoria.findById(id);
            if (!categoria) {
                throw new Error('Categoría no encontrada');
            }
            return categoria;
        } catch (error) {
            throw new Error('Error al obtener categoría: ' + error.message);
        }
    }

  static  async createCategoria(categoriaData) {
        try {
            const { nombre, tipo = 'Producto' } = categoriaData;

            if (!nombre || nombre.trim() === '') {
                throw new Error('El nombre de la categoría es requerido');
            }

            if (nombre.length < 2) {
                throw new Error('El nombre debe tener al menos 2 caracteres');
            }

            if (!['Producto', 'Servicio'].includes(tipo)) {
                throw new Error('El tipo debe ser "Producto" o "Servicio"');
            }

            const exists = await Categoria.exists(nombre);
            if (exists) {
                throw new Error('Ya existe una categoría con este nombre');
            }

            return await Categoria.create(nombre, tipo);
        } catch (error) {
            throw new Error('Error al crear categoría: ' + error.message);
        }
    }

  static  async updateCategoria(id, categoriaData) {
        try {
            const categoria = await Categoria.findById(id);
            if (!categoria) {
                throw new Error('Categoría no encontrada');
            }

            const { nombre, tipo } = categoriaData;

            if (nombre && nombre.trim() === '') {
                throw new Error('El nombre de la categoría es requerido');
            }

            if (tipo && !['Producto', 'Servicio'].includes(tipo)) {
                throw new Error('El tipo debe ser "Producto" o "Servicio"');
            }

            if (nombre && nombre !== categoria.nombre) {
                const exists = await Categoria.exists(nombre, id);
                if (exists) {
                    throw new Error('Ya existe una categoría con este nombre');
                }
            }

            return await Categoria.update(id, categoriaData);
        } catch (error) {
            throw new Error('Error al actualizar categoría: ' + error.message);
        }
    }

  static  async deleteCategoria(id) {
        try {
            const categoria = await Categoria.findById(id);
            if (!categoria) {
                throw new Error('Categoría no encontrada');
            }

            const [productos] = await db.execute(
                'SELECT COUNT(*) as count FROM productos WHERE categoria_id = ?',
                [id]
            );
            const [servicios] = await db.execute(
                'SELECT COUNT(*) as count FROM servicios WHERE categoria_id = ?',
                [id]
            );

            if (productos[0].count > 0 || servicios[0].count > 0) {
                throw new Error('No se puede eliminar la categoría porque tiene productos o servicios asociados');
            }

            const deleted = await Categoria.delete(id);
            if (!deleted) {
                throw new Error('Error al eliminar la categoría');
            }

            return { message: 'Categoría eliminada correctamente' };
        } catch (error) {
            throw new Error('Error al eliminar categoría: ' + error.message);
        }
    }
}

module.exports = CategoriaService;