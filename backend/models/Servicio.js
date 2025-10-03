// models/Servicio.js
const { executeQuery } = require('../config/db');

class Servicio {
    // Obtener todos los servicios
    static async findAll() {
        const query = `
            SELECT s.*, c.nombre as categoria_nombre 
            FROM servicios s 
            LEFT JOIN categorias c ON s.categoria_id = c.id 
            WHERE s.activo = 1
            ORDER BY s.nombre
        `;
        return await executeQuery(query);
    }

    // Obtener servicio por ID
    static async findById(id) {
        const query = `
            SELECT s.*, c.nombre as categoria_nombre 
            FROM servicios s 
            LEFT JOIN categorias c ON s.categoria_id = c.id 
            WHERE s.id = ? AND s.activo = 1
        `;
        const resultados = await executeQuery(query, [id]);
        return resultados.length > 0 ? resultados[0] : null;
    }

    // Crear nuevo servicio
    static async create(servicioData) {
        const { nombre, categoria_id, precio, descripcion = null } = servicioData;

        const query = `
            INSERT INTO servicios (nombre, categoria_id, precio, descripcion, activo) 
            VALUES (?, ?, ?, ?, 1)
        `;

        const result = await executeQuery(query, [nombre, categoria_id, precio, descripcion]);
        return this.findById(result.insertId);
    }

    // Actualizar servicio
    static async update(id, servicioData) {
        const { nombre, categoria_id, precio, descripcion } = servicioData;

        const query = `
            UPDATE servicios 
            SET nombre = ?, categoria_id = ?, precio = ?, descripcion = ? 
            WHERE id = ? AND activo = 1
        `;

        await executeQuery(query, [nombre, categoria_id, precio, descripcion, id]);
        return this.findById(id);
    }

    // Eliminar servicio (soft delete)
    static async delete(id) {
        const query = `UPDATE servicios SET activo = 0 WHERE id = ?`;
        const result = await executeQuery(query, [id]);
        return result.affectedRows > 0;
    }

    // Obtener servicios por categoría
    static async findByCategoria(categoriaId) {
        const query = `
            SELECT s.*, c.nombre as categoria_nombre 
            FROM servicios s 
            LEFT JOIN categorias c ON s.categoria_id = c.id 
            WHERE s.categoria_id = ? AND s.activo = 1
            ORDER BY s.nombre
        `;
        return await executeQuery(query, [categoriaId]);
    }

    // Verificar si existe servicio con mismo nombre
    static async findByNombre(nombre, excludeId = null) {
        let query = `SELECT * FROM servicios WHERE nombre = ? AND activo = 1`;
        const params = [nombre];

        if (excludeId) {
            query += ` AND id != ?`;
            params.push(excludeId);
        }

        const resultados = await executeQuery(query, params);
        return resultados.length > 0 ? resultados[0] : null;
    }
}

module.exports = Servicio;