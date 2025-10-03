const { db } = require('../config/db');

class Categoria {
    static async findAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM categoria WHERE Estado = "Activo"');
            return rows.map(row => ({
                id: row.ID_Categoria,
                nombre: row.Nombre,
                estado: row.Estado
            }));
        } catch (error) {
            console.error('Error en Categoria.findAll:', error.message);
            throw new Error('Error al obtener categorías de la base de datos');
        }
    }

    static async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM categoria WHERE ID_Categoria = ?', [id]);
            if (rows.length === 0) return null;

            const row = rows[0];
            return {
                id: row.ID_Categoria,
                nombre: row.Nombre,
                estado: row.Estado
            };
        } catch (error) {
            console.error('Error en Categoria.findById:', error.message);
            throw new Error('Error al obtener la categoría');
        }
    }

    static async create(nombre) {
        try {
            const [result] = await db.execute(
                'INSERT INTO categoria (Nombre, Estado) VALUES (?, "Activo")',
                [nombre]
            );
            return this.findById(result.insertId);
        } catch (error) {
            console.error('Error en Categoria.create:', error.message);

            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Ya existe una categoría con este nombre');
            }

            throw new Error('Error al crear la categoría');
        }
    }

    static async update(id, categoriaData) {
        try {
            const { nombre, estado = 'Activo' } = categoriaData;

            // Validar que nombre no sea undefined
            if (nombre === undefined) {
                throw new Error('El campo nombre es requerido');
            }

            await db.execute(
                'UPDATE categoria SET Nombre = ?, Estado = ? WHERE ID_Categoria = ?',
                [nombre, estado, id]
            );
            return this.findById(id);
        } catch (error) {
            console.error('Error en Categoria.update:', error.message);

            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Ya existe una categoría con este nombre');
            }

            throw new Error('Error al actualizar la categoría: ' + error.message);
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.execute(
                'UPDATE categoria SET Estado = "Inactivo" WHERE ID_Categoria = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en Categoria.delete:', error.message);
            throw new Error('Error al eliminar la categoría');
        }
    }

    static async exists(nombre, excludeId = null) {
        try {
            let query = 'SELECT COUNT(*) as count FROM categoria WHERE Nombre = ?';
            const params = [nombre];

            if (excludeId) {
                query += ' AND ID_Categoria != ?';
                params.push(excludeId);
            }

            const [rows] = await db.execute(query, params);
            return rows[0].count > 0;
        } catch (error) {
            console.error('Error en Categoria.exists:', error.message);
            return false;
        }
    }
}

module.exports = Categoria;