const ordenesService = require('../services/OrdenesService.js');
const ordenItemsService = require('../services/OrdenItemsService.js');
const { OrdenCreateDTO, OrdenUpdateDTO, OrdenResponseDTO } = require('../dto/OrdenesDTO');

// Necesitarás estos servicios - asegúrate de que existan
const UsuariosService = require('../services/UsuariosService.js');
const ProductosService = require('../services/ProductosService.js');

class OrdenController {
    
    // MÉTODOS EXISTENTES (API) - NO CAMBIAN
 
    static async crear(req, res) {
        try {
            console.log('=== CREANDO ORDEN ===');
            
            const ordenDTO = new OrdenCreateDTO(req.body);
            const errors = ordenDTO.validate();
            
            if (errors.length > 0) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Errores de validación', 
                    errors: errors 
                });
            }

            console.log('DTO válido, creando orden...');
            const insertId = await ordenesService.crear(ordenDTO);
            const nuevaOrden = await ordenesService.obtenerPorId(insertId);
            
            const ordenResponse = new OrdenResponseDTO(nuevaOrden);
            
            console.log('ORDEN CREADA EXITOSAMENTE');
            console.log('Orden:', ordenResponse.toSummary());

            res.status(201).json({ 
                success: true,
                message: 'Orden creada exitosamente', 
                data: ordenResponse.toDetail()
            });
            
        } catch (error) {
            console.error('Error en crear:', error);
            res.status(500).json({ 
                success: false,
                message: 'Error al crear la orden: ' + error.message 
            });
        }
    }

    static async obtenerTodos(req, res) {
        try {
            const ordenes = await ordenesService.obtenerTodos();
            
            const ordenesResponse = ordenes.map(orden => 
                new OrdenResponseDTO(orden).toSummary()
            );

            res.status(200).json({
                success: true,
                data: ordenesResponse,
                count: ordenesResponse.length
            });
        } catch (error) {
            console.error("Error en obtenerTodos:", error);
            res.status(500).json({ 
                success: false,
                message: 'Error al obtener las órdenes: ' + error.message 
            });
        }
    }

    static async obtenerPorId(req, res) {
        try {
            const id = req.params.id;
            const orden = await ordenesService.obtenerPorId(id);

            if (!orden) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Orden no encontrada' 
                });
            }

            const ordenResponse = new OrdenResponseDTO(orden);

            res.status(200).json({
                success: true,
                data: ordenResponse.toDetail()
            });
        } catch (error) {
            console.error("Error en obtenerPorId:", error);
            res.status(500).json({ 
                success: false,
                message: 'Error al obtener la orden: ' + error.message 
            });
        }
    }

    static async actualizar(req, res) {
        try {
            const id = req.params.id;
            const ordenDTO = new OrdenUpdateDTO(req.body);
            const errors = ordenDTO.validate();
            
            if (errors.length > 0) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Errores de validación', 
                    errors: errors 
                });
            }

            const actualizado = await ordenesService.actualizar(id, ordenDTO);

            if (!actualizado) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Orden no encontrada' 
                });
            }

            res.status(200).json({ 
                success: true,
                message: 'Orden actualizada exitosamente' 
            });
        } catch (error) {
            console.error("Error en actualizar:", error);
            res.status(500).json({ 
                success: false,
                message: 'Error al actualizar la orden: ' + error.message 
            });
        }
    }

    static async eliminar(req, res) {
        try {
            const id = req.params.id;
            const eliminado = await ordenesService.eliminar(id);

            if (!eliminado) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Orden no encontrada' 
                });
            }

            res.status(200).json({ 
                success: true,
                message: 'Orden eliminada exitosamente' 
            });
        } catch (error) {
            console.error("Error en eliminar:", error);
            res.status(500).json({ 
                success: false,
                message: 'Error al eliminar la orden: ' + error.message 
            });
        }
    }

    static async obtenerPorCliente(req, res) {
        try {
            const clienteId = req.params.clienteId;
            const ordenes = await ordenesService.obtenerPorCliente(clienteId);
            
            const ordenesResponse = ordenes.map(orden => 
                new OrdenResponseDTO(orden).toSummary()
            );

            res.status(200).json({
                success: true,
                data: ordenesResponse,
                count: ordenesResponse.length
            });
        } catch (error) {
            console.error("Error en obtenerPorCliente:", error);
            res.status(500).json({ 
                success: false,
                message: 'Error al obtener las órdenes del cliente: ' + error.message 
            });
        }
    }

    // MÉTODOS NUEVOS PARA VISTAS (HTML)

    static async mostrarListaVista(req, res) {
        try {
            const ordenes = await ordenesService.obtenerTodos();
            res.render('ordenes/list', { 
                ordenes: ordenes,
                message: req.query.message,
                error: req.query.error
            });
        } catch (error) {
            res.render('ordenes/list', { 
                ordenes: [],
                error: error.message 
            });
        }
    }

    static async mostrarCrearVista(req, res) {
        try {
            // Obtener clientes para el dropdown
            const clientes = await UsuariosService.obtenerTodos(); // Ajusta según tu servicio
            res.render('ordenes/create', { 
                clientes: clientes,
                error: req.query.error
            });
        } catch (error) {
            res.render('ordenes/create', { 
                clientes: [],
                error: error.message 
            });
        }
    }

    static async mostrarDetalleVista(req, res) {
        try {
            const ordenId = req.params.id;
            const orden = await ordenesService.obtenerPorId(ordenId);
            const items = await ordenItemsService.obtenerPorOrden(ordenId);
            const productos = await ProductosService.obtenerTodos(); // Para dropdown
            
            res.render('ordenes/detail', { 
                orden: orden,
                items: items,
                productos: productos,
                message: req.query.message,
                error: req.query.error
            });
        } catch (error) {
            res.redirect('/ordenes?error=' + encodeURIComponent(error.message));
        }
    }

    static async mostrarEditarVista(req, res) {
        try {
            const ordenId = req.params.id;
            const orden = await ordenesService.obtenerPorId(ordenId);
            const clientes = await UsuariosService.obtenerTodos(); // Ajusta según tu servicio
            
            res.render('ordenes/edit', { 
                orden: orden,
                clientes: clientes,
                error: req.query.error
            });
        } catch (error) {
            res.redirect('/ordenes?error=' + encodeURIComponent(error.message));
        }
    }
    
    // MÉTODO para crear desde formulario HTML
    static async crearDesdeFormulario(req, res) {
        try {
            const ordenDTO = new OrdenCreateDTO(req.body);
            const errors = ordenDTO.validate();
            
            if (errors.length > 0) {
                return res.redirect('/ordenes/create?error=' + encodeURIComponent(errors.join(', ')));
            }

            const insertId = await ordenesService.crear(ordenDTO);
            
            // Redirigir a la vista de detalle de la nueva orden
            res.redirect('/ordenes/' + insertId + '?message=Orden creada exitosamente');
            
        } catch (error) {
            res.redirect('/ordenes/create?error=' + encodeURIComponent(error.message));
        }
    }

    // MÉTODO para actualizar desde formulario HTML
    static async actualizarDesdeFormulario(req, res) {
        try {
            const id = req.params.id;
            const ordenDTO = new OrdenUpdateDTO(req.body);
            const errors = ordenDTO.validate();
            
            if (errors.length > 0) {
                return res.redirect('/ordenes/edit/' + id + '?error=' + encodeURIComponent(errors.join(', ')));
            }

            const actualizado = await ordenesService.actualizar(id, ordenDTO);

            if (!actualizado) {
                return res.redirect('/ordenes/edit/' + id + '?error=Orden no encontrada');
            }

            res.redirect('/ordenes/' + id + '?message=Orden actualizada exitosamente');
            
        } catch (error) {
            res.redirect('/ordenes/edit/' + id + '?error=' + encodeURIComponent(error.message));
        }
    }
}

module.exports = OrdenController;