// models/Servicio.js
const { db } = require('../config/db');

class Servicio {
    /**
     * Obtener todos los servicios con filtros opcionales
     */
    static async findAll(filters = {}) {
        try {
            let query = `
                SELECT 
                    s.id,
                    s.nombre,
                    s.categoria_id,
                    s.precio,
                    c.nombre as categoria_nombre,
                    c.tipo as categoria_tipo
                FROM servicios s
                INNER JOIN categorias c ON s.categoria_id = c.id
                WHERE 1=1
            `;
            const params = [];

            // Filtro por nombre
            if (filters.nombre) {
                query += ' AND s.nombre LIKE ?';
                params.push(`%${filters.nombre}%`);
            }

            // Filtro por categoría
            if (filters.categoria_id) {
                query += ' AND s.categoria_id = ?';
                params.push(filters.categoria_id);
            }

            // Filtro por precio mínimo
            if (filters.minPrecio) {
                query += ' AND s.precio >= ?';
                params.push(parseFloat(filters.minPrecio));
            }

            // Filtro por precio máximo
            if (filters.maxPrecio) {
                query += ' AND s.precio <= ?';
                params.push(parseFloat(filters.maxPrecio));
            }

            query += ' ORDER BY s.nombre ASC';

            const [rows] = await db.execute(query, params);
            return rows;
        } catch (error) {
            console.error('Error en Servicio.findAll:', error);
            throw new Error('Error al obtener servicios de la base de datos');
        }
    }

    /**
     * Buscar servicio por ID
     */
    static async findById(id) {
        try {
            const query = `
                SELECT 
                    s.id,
                    s.nombre,
                    s.categoria_id,
                    s.precio,
                    c.nombre as categoria_nombre,
                    c.tipo as categoria_tipo
                FROM servicios s
                INNER JOIN categorias c ON s.categoria_id = c.id
                WHERE s.id = ?
            `;

            const [rows] = await db.execute(query, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error en Servicio.findById:', error);
            throw new Error('Error al obtener el servicio');
        }
    }

    /**
     * Crear un nuevo servicio
     */
    static async create(servicioData) {
        try {
            const { nombre, categoria_id, precio } = servicioData;

            const query = `
                INSERT INTO servicios (nombre, categoria_id, precio)
                VALUES (?, ?, ?)
            `;

            const [result] = await db.execute(query, [nombre, categoria_id, precio]);

            // Retornar el servicio creado
            return await this.findById(result.insertId);
        } catch (error) {
            console.error('Error en Servicio.create:', error);

            // Manejar error de clave foránea (categoría no existe)
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new Error('La categoría especificada no existe');
            }

            throw new Error('Error al crear el servicio en la base de datos');
        }
    }

    /**
     * Actualizar un servicio existente
     */
    static async update(id, servicioData) {
        try {
            const { nombre, categoria_id, precio } = servicioData;

            const query = `
                UPDATE servicios 
                SET nombre = ?, categoria_id = ?, precio = ?
                WHERE id = ?
            `;

            await db.execute(query, [nombre, categoria_id, precio, id]);

            // Retornar el servicio actualizado
            return await this.findById(id);
        } catch (error) {
            console.error('Error en Servicio.update:', error);

            // Manejar error de clave foránea
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new Error('La categoría especificada no existe');
            }

            throw new Error('Error al actualizar el servicio en la base de datos');
        }
    }

    /**
     * Eliminar un servicio
     */
    static async delete(id) {
        try {
            const query = 'DELETE FROM servicios WHERE id = ?';
            const [result] = await db.execute(query, [id]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en Servicio.delete:', error);

            // Manejar error de clave foránea (servicio usado en orden_items)
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                throw new Error('No se puede eliminar el servicio porque está siendo usado en órdenes');
            }

            throw new Error('Error al eliminar el servicio de la base de datos');
        }
    }

    /**
     * Verificar si un servicio existe
     */
    static async exists(id) {
        try {
            const query = 'SELECT COUNT(*) as count FROM servicios WHERE id = ?';
            const [rows] = await db.execute(query, [id]);

            return rows[0].count > 0;
        } catch (error) {
            console.error('Error en Servicio.exists:', error);
            return false;
        }
    }

    /**
     * Verificar si una categoría existe y es de tipo Servicio
     */
    static async validarCategoria(categoria_id) {
        try {
            const query = `
                SELECT id, nombre, tipo 
                FROM categorias 
                WHERE id = ? AND tipo = 'Servicio'
            `;

            const [rows] = await db.execute(query, [categoria_id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error en Servicio.validarCategoria:', error);
            return null;
        }
    }
}

module.exports = Servicio;