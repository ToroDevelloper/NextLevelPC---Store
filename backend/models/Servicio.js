
const { executeQuery } = require('../config/db');

class Servicio {

    static async findAll() {
        const query = `
            SELECT * 
            FROM servicios 
            WHERE activo = 1
            ORDER BY tipo, nombre
        `;
        return await executeQuery(query);
    }


    static async findByTipo(tipo) {
        const query = `
            SELECT * 
            FROM servicios 
            WHERE activo = 1 AND tipo = ?
            ORDER BY nombre
        `;
        return await executeQuery(query, [tipo]);
    }


    static async findById(id) {
        const query = `
            SELECT * 
            FROM servicios 
            WHERE id = ? AND activo = 1
        `;
        const resultados = await executeQuery(query, [id]);
        return resultados.length > 0 ? resultados[0] : null;
    }


    static async create(servicioData) {
        const { nombre, tipo = 'basico', precio, descripcion = null } = servicioData;

        const query = `
            INSERT INTO servicios (nombre, tipo, precio, descripcion, activo) 
            VALUES (?, ?, ?, ?, 1)
        `;

        const result = await executeQuery(query, [nombre, tipo, precio, descripcion]);
        return this.findById(result.insertId);
    }


    static async update(id, servicioData) {
        const { nombre, tipo, precio, descripcion } = servicioData;

        const query = `
            UPDATE servicios 
            SET nombre = ?, tipo = ?, precio = ?, descripcion = ? 
            WHERE id = ? AND activo = 1
        `;

        await executeQuery(query, [nombre, tipo, precio, descripcion, id]);
        return this.findById(id);
    }


    static async delete(id) {
        const query = `UPDATE servicios SET activo = 0 WHERE id = ?`;
        const result = await executeQuery(query, [id]);
        return result.affectedRows > 0;
    }


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