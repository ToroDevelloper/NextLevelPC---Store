const { executeQuery } = require('../config/db');

class CitaServicio {
    static async create(citaData) {
        const {
            servicio_id,
            nombre,
            email,
            telefono,
            direccion,
            fecha,
            descripcion
        } = citaData;

        const query = `
            INSERT INTO citas_servicios (
                servicio_id, nombre_cliente, email_cliente, telefono_cliente, 
                direccion_cliente, fecha_cita, descripcion_problema
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            servicio_id,
            nombre,
            email,
            telefono,
            direccion,
            fecha,
            descripcion
        ];

        const result = await executeQuery(query, params);
        return { id: result.insertId, ...citaData };
    }
}

module.exports = CitaServicio;

