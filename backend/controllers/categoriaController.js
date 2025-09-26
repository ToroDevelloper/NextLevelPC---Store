const categoriaService = require('../service/categoriaService');

class CategoriaController {
    async getCategorias(req, res) {
        try {
            const categorias = await categoriaService.getAllCategorias();
            res.json({
                success: true,
                data: categorias,
                count: categorias.length
            });
        } catch (error) {
            console.error('Error en getCategorias:', error.message);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getCategoria(req, res) {
        try {
            const { id } = req.params;
            const categoria = await categoriaService.getCategoriaById(id);
            res.json({
                success: true,
                data: categoria
            });
        } catch (error) {
            console.error('Error en getCategoria:', error.message);
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    async createCategoria(req, res) {
        try {
            const categoria = await categoriaService.createCategoria(req.body);
            res.status(201).json({
                success: true,
                message: 'Categoría creada correctamente',
                data: categoria
            });
        } catch (error) {
            console.error('Error en createCategoria:', error.message);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateCategoria(req, res) {
        try {
            const { id } = req.params;
            const categoria = await categoriaService.updateCategoria(id, req.body);
            res.json({
                success: true,
                message: 'Categoría actualizada correctamente',
                data: categoria
            });
        } catch (error) {
            console.error('Error en updateCategoria:', error.message);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteCategoria(req, res) {
        try {
            const { id } = req.params;
            await categoriaService.deleteCategoria(id);
            res.json({
                success: true,
                message: 'Categoría eliminada correctamente'
            });
        } catch (error) {
            console.error('Error en deleteCategoria:', error.message);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new CategoriaController();