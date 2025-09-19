const db = require('../config/db.js');

class ProductoModel {

    // Obtener todos los productos
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM productos');
        return rows;
    }

    // Buscar producto por ID
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    // Crear producto
    static async create(producto) {
        const {
            sku, nombre, marca, modelo, categoria_id, descripcion, imagenes,
            atributos, precio_actual, impuestos, garantia, activo
        } = producto;

        const [result] = await db.query(
            `INSERT INTO productos 
        (sku, nombre, marca, modelo, categoria_id, descripcion, imagenes, atributos, precio_actual, impuestos, garantia, activo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                sku, nombre, marca, modelo, categoria_id, descripcion,
                JSON.stringify(imagenes || []),   // se guarda como JSON
                JSON.stringify(atributos || {}),  // se guarda como JSON
                precio_actual || 0.00,
                JSON.stringify(impuestos || []),  // se guarda como JSON
                garantia,
                activo ?? 1
            ]
        );

        return result.insertId;
    }

    // Actualizar producto
    static async update(id, producto) {
        const {
            sku, nombre, marca, modelo, categoria_id, descripcion, imagenes,
            atributos, precio_actual, impuestos, garantia, activo
        } = producto;

        const [result] = await db.query(
            `UPDATE productos 
       SET sku = ?, nombre = ?, marca = ?, modelo = ?, categoria_id = ?, 
           descripcion = ?, imagenes = ?, atributos = ?, precio_actual = ?, 
           impuestos = ?, garantia = ?, activo = ?
       WHERE id = ?`,
            [
                sku, nombre, marca, modelo, categoria_id, descripcion,
                JSON.stringify(imagenes || []),
                JSON.stringify(atributos || {}),
                precio_actual || 0.00,
                JSON.stringify(impuestos || []),
                garantia,
                activo ?? 1,
                id
            ]
        );

        return result.affectedRows;
    }

    // Eliminar producto
    static async delete(id) {
        const [result] = await db.query('DELETE FROM productos WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = ProductoModel;
