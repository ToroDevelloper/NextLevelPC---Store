const categoriaService = require('../services/categoriaService');

class CategoriaController {
    async getCategorias(req, res) {
        try {
            const categorias = await categoriaService.getAllCategorias();
            res.json(categorias);  // Array directo de categorías
        } catch (error) {
            console.error('Error en getCategorias:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    async getCategoria(req, res) {
        try {
            const { id } = req.params;
            const categoria = await categoriaService.getCategoriaById(id);
            res.json(categoria);  // Objeto categoría directo
        } catch (error) {
            console.error('Error en getCategoria:', error.message);
            res.status(404).json({ error: error.message });
        }
    }

    async createCategoria(req, res) {
        try {
            const categoria = await categoriaService.createCategoria(req.body);
            res.status(201).json({
                message: "Categoría creada correctamente",
                id: categoria.id,
                nombre: categoria.nombre,
                estado: categoria.estado
            });
        } catch (error) {
            console.error('Error en createCategoria:', error.message);
            res.status(400).json({ error: error.message });
        }
    }

    async updateCategoria(req, res) {
        try {
            const { id } = req.params;
            const categoria = await categoriaService.updateCategoria(id, req.body);
            res.json({
                message: "Categoría actualizada correctamente",
                id: categoria.id,
                nombre: categoria.nombre,
                estado: categoria.estado
            });
        } catch (error) {
            console.error('Error en updateCategoria:', error.message);
            res.status(400).json({ error: error.message });
        }
    }

    async deleteCategoria(req, res) {
        try {
            const { id } = req.params;
            await categoriaService.deleteCategoria(id);
            res.json({
                message: "Categoría eliminada correctamente",
                id: parseInt(id)
            });
        } catch (error) {
            console.error('Error en deleteCategoria:', error.message);
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new CategoriaController();