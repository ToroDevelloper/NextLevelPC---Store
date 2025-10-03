const { executeQuery } = require('../config/db');

class Servicio {
    static async findAll() {
        try {
            const rows = await executeQuery('SELECT * FROM servicios');
            return rows;
        } catch (error) {
            console.error('Error en Servicio.findAll:', error.message);
            throw new Error('Error al obtener servicios de la base de datos');
        }
    }

    static async findById(id) {
        try {
            // Si la columna se llama ID_Servicio en lugar de id
            const rows = await executeQuery('SELECT * FROM servicios WHERE ID_Servicio = ?', [id]);
            if (rows.length === 0) return null;
            return rows[0];
        } catch (error) {
            console.error('Error en Servicio.findById:', error.message);
            throw new Error('Error al obtener el servicio');
        }
    }

    static async create(servicioData) {
        try {
            const { tipo, descripcion, precio } = servicioData;
            const result = await executeQuery(
                'INSERT INTO servicios (tipo, descripcion, precio) VALUES (?, ?, ?)',
                [tipo, descripcion, precio]
            );

            // Usar el nombre correcto de la columna ID
            const [newService] = await executeQuery('SELECT * FROM servicios WHERE ID_Servicio = ?', [result.insertId]);
            return newService;
        } catch (error) {
            console.error('Error en Servicio.create:', error.message);
            throw new Error('Error al crear el servicio');
        }
    }

    static async update(id, servicioData) {
        try {
            const { tipo, descripcion, precio } = servicioData;
            await executeQuery(
                'UPDATE servicios SET tipo = ?, descripcion = ?, precio = ? WHERE ID_Servicio = ?',
                [tipo, descripcion, precio, id]
            );

            const [updatedService] = await executeQuery('SELECT * FROM servicios WHERE ID_Servicio = ?', [id]);
            return updatedService;
        } catch (error) {
            console.error('Error en Servicio.update:', error.message);
            throw new Error('Error al actualizar el servicio: ' + error.message);
        }
    }

    static async delete(id) {
        try {
            const result = await executeQuery('DELETE FROM servicios WHERE ID_Servicio = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en Servicio.delete:', error.message);
            throw new Error('Error al eliminar el servicio');
        }
    }
}

module.exports = Servicio;