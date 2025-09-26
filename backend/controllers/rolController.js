const RolService = require('../services/rolService');

class RolController {
    static async obtenerTodos(req, res) {
        try {
            const roles = await RolService.obtenerTodosLosRoles();
            res.json({
                success: true,
                data: roles,
                message: 'Roles obtenidos correctamente'
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
            const rol = await RolService.obtenerRolPorId(id);
            res.json({
                success: true,
                data: rol,
                message: 'Rol obtenido correctamente'
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    static async crear(req, res) {
        try {
            const { Nombre, Descripcion } = req.body;

            if (!Nombre) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre del rol es requerido'
                });
            }

            const nuevoRolId = await RolService.crearRol({ Nombre, Descripcion });
            res.status(201).json({
                success: true,
                data: { id: nuevoRolId },
                message: 'Rol creado correctamente'
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
            const datosActualizados = req.body;

            if (Object.keys(datosActualizados).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No se proporcionaron datos para actualizar'
                });
            }

            const rolActualizado = await RolService.actualizarRol(id, datosActualizados);
            res.json({
                success: true,
                data: rolActualizado,
                message: 'Rol actualizado correctamente'
            });
        } catch (error) {
            const statusCode = error.message.includes('no encontrado') ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    static async eliminar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await RolService.eliminarRol(id);
            res.json({
                success: true,
                data: resultado,
                message: 'Rol eliminado correctamente'
            });
        } catch (error) {
            const statusCode = error.message.includes('no encontrado') ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    static async obtenerUsuarios(req, res) {
        try {
            const { id } = req.params;
            const usuarios = await RolService.obtenerUsuariosPorRol(id);
            res.json({
                success: true,
                data: usuarios,
                message: 'Usuarios del rol obtenidos correctamente'
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = RolController;