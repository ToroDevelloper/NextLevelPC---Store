// models/Servicio.js
const { executeQuery } = require('../config/db');

class Servicio {
    // Obtener todos los servicios — SIN JOIN con categorías
    static async findAll() {
        const query = `
            SELECT * 
            FROM servicios 
            WHERE activo = 1
            ORDER BY nombre
        `;
        return await executeQuery(query);
    }

    // Obtener servicio por ID — SIN JOIN
    static async findById(id) {
        const query = `
            SELECT * 
            FROM servicios 
            WHERE id = ? AND activo = 1
        `;
        const resultados = await executeQuery(query, [id]);
        return resultados.length > 0 ? resultados[0] : null;
    }

    // Crear nuevo servicio — sin categoria_id
    static async create(servicioData) {
        const { nombre, precio, descripcion = null } = servicioData;

        const query = `
            INSERT INTO servicios (nombre, precio, descripcion, activo) 
            VALUES (?, ?, ?, 1)
        `;

        const result = await executeQuery(query, [nombre, precio, descripcion]);
        return this.findById(result.insertId);
    }

    // Actualizar servicio — sin categoria_id
    static async update(id, servicioData) {
        const { nombre, precio, descripcion } = servicioData;

        const query = `
            UPDATE servicios 
            SET nombre = ?, precio = ?, descripcion = ? 
            WHERE id = ? AND activo = 1
        `;

        await executeQuery(query, [nombre, precio, descripcion, id]);
        return this.findById(id);
    }

    // Eliminar servicio (soft delete)
    static async delete(id) {
        const query = `UPDATE servicios SET activo = 0 WHERE id = ?`;
        const result = await executeQuery(query, [id]);
        return result.affectedRows > 0;
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