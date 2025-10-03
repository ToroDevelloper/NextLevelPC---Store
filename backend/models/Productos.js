const { executeQuery } = require('../config/db.js');

class Productos {
    constructor(id, sku, nombre, marca, modelo, categoria_id, descripcion, imagenes, atributos, precio_actual, impuesto_porcentaje, garantia, activo, created_at, updated_at) {
        this.id = id;
        this.sku = sku;
        this.nombre = nombre;
        this.marca = marca;
        this.modelo = modelo;
        this.categoria_id = categoria_id;
        this.descripcion = descripcion;
        this.imagenes = imagenes;
        this.atributos = atributos;
        this.precio_actual = precio_actual;
        this.impuesto_porcentaje = impuesto_porcentaje;
        this.garantia = garantia;
        this.activo = activo;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static async obtenerTodos() {
        const rows = await executeQuery('SELECT * FROM producto');
        return rows.map(row => this.convertRowToProducto(row));
    }

    static async obtenerTodosConInactivos() {
        const rows = await executeQuery('SELECT * FROM producto');
        return rows.map(row => this.convertRowToProducto(row));
    }

    static async obtenerPorId(id) {
        const rows = await executeQuery('SELECT * FROM producto WHERE ID_Producto = ?', [id]);
        return rows.length > 0 ? this.convertRowToProducto(rows[0]) : null;
    }

    static async obtenerPorSku(sku) {
        const rows = await executeQuery('SELECT * FROM producto WHERE Serial = ?', [sku]);
        return rows.length > 0 ? this.convertRowToProducto(rows[0]) : null;
    }

    static async obtenerPorCategoria(categoria_id) {
        const rows = await executeQuery('SELECT * FROM producto WHERE ID_Categoria = ?', [categoria_id]);
        return rows.map(row => this.convertRowToProducto(row));
    }

    static async crear(data) {
        const { sku, nombre, marca, modelo, categoria_id, descripcion, imagenes, atributos, precio_actual, impuesto_porcentaje, garantia } = data;

        const result = await executeQuery(
            `INSERT INTO producto
             (Serial, Nombres, Marca, ID_Categoria, Descripcion, Precio, Stock)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                sku || null,
                nombre || '',
                marca || '',
                categoria_id || 0,
                descripcion || '',
                precio_actual || 0.00,
                0 // Stock inicial
            ]
        );

        return result.insertId;
    }

    static async actualizar(id, data) {
        // Preparar los campos y valores para la actualización
        const campos = Object.keys(data);
        if (campos.length === 0) return false;

        // Convertir campos JSON a string si existen
        if (data.imagenes && typeof data.imagenes !== 'string') {
            data.imagenes = JSON.stringify(data.imagenes);
        }
        if (data.atributos && typeof data.atributos !== 'string') {
            data.atributos = JSON.stringify(data.atributos);
        }

        // Mapear campos de tu modelo a los campos de la base de datos
        const updates = [];
        const values = [];

        for (const campo in data) {
            switch (campo) {
                case 'sku':
                    updates.push('Serial = ?');
                    values.push(data[campo] || null);
                    break;
                case 'nombre':
                    updates.push('Nombres = ?');
                    values.push(data[campo] || '');
                    break;
                case 'marca':
                    updates.push('Marca = ?');
                    values.push(data[campo] || '');
                    break;
                case 'categoria_id':
                    updates.push('ID_Categoria = ?');
                    values.push(parseInt(data[campo]) || 0);
                    break;
                case 'descripcion':
                    updates.push('Descripcion = ?');
                    values.push(data[campo] || '');
                    break;
                case 'precio_actual':
                    updates.push('Precio = ?');
                    values.push(parseFloat(data[campo]) || 0.00);
                    break;
                case 'stock':
                    updates.push('Stock = ?');
                    values.push(parseInt(data[campo]) || 0);
                    break;
                // Ignorar campos que no existen en la tabla
                case 'modelo':
                case 'imagenes':
                case 'atributos':
                case 'impuesto_porcentaje':
                case 'garantia':
                case 'activo':
                    break;
            }
        }

        if (updates.length === 0) {
            return false;
        }

        const columnas = updates.join(', ');
        values.push(id); // ID para WHERE

        const result = await executeQuery(
            `UPDATE producto SET ${columnas} WHERE ID_Producto = ?`,
            values
        );

        return result.affectedRows > 0;
    }

    static async eliminar(id) {
        const result = await executeQuery('DELETE FROM producto WHERE ID_Producto = ?', [id]);
        return result.affectedRows > 0;
    }

    static async eliminarDefinitivamente(id) {
        const result = await executeQuery('DELETE FROM producto WHERE ID_Producto = ?', [id]);
        return result.affectedRows > 0;
    }

    static async activar(id) {
        return true; // Simulamos éxito
    }

    static async buscarPorNombre(nombre) {
        const rows = await executeQuery('SELECT * FROM producto WHERE Nombres LIKE ?', [`%${nombre}%`]);
        return rows.map(row => this.convertRowToProducto(row));
    }

    static async skuEnUsoPorOtroProducto(sku, id) {
        const rows = await executeQuery(
            'SELECT ID_Producto FROM producto WHERE Serial = ? AND ID_Producto != ?',
            [sku, id]
        );
        return rows.length > 0;
    }

    static async obtenerConCategoria(id = null) {
        let query = `
            SELECT p.*, c.nombre as categoria_nombre
            FROM producto p
                     LEFT JOIN categorias c ON p.ID_Categoria = c.id
        `;

        if (id) {
            query += ' WHERE p.ID_Producto = ?';
            const rows = await executeQuery(query, [id]);
            return rows.length > 0 ? this.convertRowToProducto(rows[0]) : null;
        } else {
            const rows = await executeQuery(query);
            return rows.map(row => this.convertRowToProducto(row));
        }
    }

    // Función auxiliar para convertir filas de la base de datos a objetos Producto
    static convertRowToProducto(row) {
        return {
            id: row.ID_Producto,
            sku: row.Serial,
            nombre: row.Nombres,
            marca: row.Marca,
            modelo: '', // No existe en tu tabla
            categoria_id: row.ID_Categoria,
            descripcion: row.Descripcion,
            imagenes: [], // No existe en tu tabla
            atributos: {}, // No existe en tu tabla
            precio_actual: row.Precio,
            impuesto_porcentaje: 19.00, // Valor por defecto
            garantia: '', // No existe en tu tabla
            activo: true, // No existe en tu tabla
            created_at: row.created_at || new Date(),
            updated_at: row.updated_at || new Date()
        };
    }
}

module.exports = Productos;