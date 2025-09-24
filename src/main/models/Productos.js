const db = require('../config/db.js')

class Productos {
    constructor(id, sku, nombre, marca, modelo, categoria_id, descripcion, imagenes, atributos, precio_actual, impuesto_porcentaje, garantia, activo, created_at, updated_at) {
        this.id = id,
            this.sku = sku,
            this.nombre = nombre,
            this.marca = marca,
            this.modelo = modelo,
            this.categoria_id = categoria_id,
            this.descripcion = descripcion,
            this.imagenes = imagenes,
            this.atributos = atributos,
            this.precio_actual = precio_actual,
            this.impuesto_porcentaje = impuesto_porcentaje,
            this.garantia = garantia,
            this.activo = activo,
            this.created_at = created_at,
            this.updated_at = updated_at
    }

    static async obtenerTodos() {
        const [rows] = await db.query('SELECT * FROM productos WHERE activo = 1')
        return rows
    }

    static async obtenerTodosConInactivos() {
        const [rows] = await db.query('SELECT * FROM productos')
        return rows
    }

    static async obtenerPorId(id) {
        const [rows] = await db.query('SELECT * FROM productos WHERE id = ?', [id])
        return rows.length > 0 ? rows[0] : null
    }

    static async obtenerPorSku(sku) {
        const [rows] = await db.query('SELECT * FROM productos WHERE sku = ?', [sku])
        return rows.length > 0 ? rows[0] : null
    }

    static async obtenerPorCategoria(categoria_id) {
        const [rows] = await db.query('SELECT * FROM productos WHERE categoria_id = ? AND activo = 1', [categoria_id])
        return rows
    }

    static async crear(data) {
        const { sku, nombre, marca, modelo, categoria_id, descripcion, imagenes, atributos, precio_actual, impuesto_porcentaje, garantia } = data

        const [result] = await db.query(
            `INSERT INTO productos
             (sku, nombre, marca, modelo, categoria_id, descripcion, imagenes, atributos, precio_actual, impuesto_porcentaje, garantia)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [sku, nombre, marca, modelo, categoria_id, descripcion, JSON.stringify(imagenes), JSON.stringify(atributos), precio_actual, impuesto_porcentaje, garantia]
        )

        return result.insertId
    }

    static async actualizar(id, data) {
        // Preparar los campos y valores para la actualización
        const campos = Object.keys(data)
        if (campos.length === 0) return false

        // Convertir campos JSON a string si existen
        if (data.imagenes && typeof data.imagenes !== 'string') {
            data.imagenes = JSON.stringify(data.imagenes)
        }
        if (data.atributos && typeof data.atributos !== 'string') {
            data.atributos = JSON.stringify(data.atributos)
        }

        const columnas = campos.map(campo => `${campo} = ?`).join(', ')
        const valores = Object.values(data)

        const [result] = await db.query(
            `UPDATE productos SET ${columnas} WHERE id = ?`,
            [...valores, id]
        )

        return result.affectedRows > 0
    }

    static async eliminar(id) {
        // Eliminación lógica (cambiar activo a 0)
        const [result] = await db.query('UPDATE productos SET activo = 0 WHERE id = ?', [id])
        return result.affectedRows > 0
    }

    static async eliminarDefinitivamente(id) {
        // Eliminación física de la base de datos
        const [result] = await db.query('DELETE FROM productos WHERE id = ?', [id])
        return result.affectedRows > 0
    }

    static async activar(id) {
        const [result] = await db.query('UPDATE productos SET activo = 1 WHERE id = ?', [id])
        return result.affectedRows > 0
    }

    static async buscarPorNombre(nombre) {
        const [rows] = await db.query('SELECT * FROM productos WHERE nombre LIKE ? AND activo = 1', [`%${nombre}%`])
        return rows
    }

    static async skuEnUsoPorOtroProducto(sku, id) {
        const [rows] = await db.query(
            'SELECT id FROM productos WHERE sku = ? AND id != ?',
            [sku, id]
        )
        return rows.length > 0
    }

    static async obtenerConCategoria(id = null) {
        let query = `
            SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p 
            LEFT JOIN categorias c ON p.categoria_id = c.id
        `

        if (id) {
            query += ' WHERE p.id = ?'
            const [rows] = await db.query(query, [id])
            return rows.length > 0 ? rows[0] : null
        } else {
            query += ' WHERE p.activo = 1'
            const [rows] = await db.query(query)
            return rows
        }
    }
}

module.exports = Productos