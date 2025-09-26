const Categoria = require('../models/Categoria');

class CategoriaService {
    async getAllCategorias() {
        try {
            return await Categoria.findAll();
        } catch (error) {
            throw new Error('Error al obtener categorías: ' + error.message);
        }
    }

    async getCategoriaById(id) {
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

    async createCategoria(categoriaData) {
        try {
            const { nombre } = categoriaData;

            // Validaciones
            if (!nombre || nombre.trim() === '') {
                throw new Error('El nombre de la categoría es requerido');
            }

            if (nombre.length < 2) {
                throw new Error('El nombre debe tener al menos 2 caracteres');
            }

            // Verificar si ya existe
            const exists = await Categoria.exists(nombre);
            if (exists) {
                throw new Error('Ya existe una categoría con este nombre');
            }

            return await Categoria.create(nombre);
        } catch (error) {
            throw new Error('Error al crear categoría: ' + error.message);
        }
    }

    async updateCategoria(id, categoriaData) {
        try {
            const categoria = await Categoria.findById(id);
            if (!categoria) {
                throw new Error('Categoría no encontrada');
            }

            if (categoriaData.nombre && categoriaData.nombre.trim() === '') {
                throw new Error('El nombre de la categoría es requerido');
            }

            // Verificar duplicado (excluyendo la categoría actual)
            if (categoriaData.nombre && categoriaData.nombre !== categoria.nombre) {
                const exists = await Categoria.exists(categoriaData.nombre, id);
                if (exists) {
                    throw new Error('Ya existe una categoría con este nombre');
                }
            }

            return await Categoria.update(id, categoriaData);
        } catch (error) {
            throw new Error('Error al actualizar categoría: ' + error.message);
        }
    }

    async deleteCategoria(id) {
        try {
            const categoria = await Categoria.findById(id);
            if (!categoria) {
                throw new Error('Categoría no encontrada');
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

module.exports = new CategoriaService();