const db = require('../config/db.js');

class Productos {
    constructor(ID_Producto, SKU, Nombre, Marca, Modelo, Categoria_ID, Descripcion, Imagenes, Atributos, Precio_Actual, Impuestos, Garantia, Activo, Created_at, Updated_at) {
        this.ID_Producto = ID_Producto,
            this.SKU = SKU,
            this.Nombre = Nombre,
            this.Marca = Marca,
            this.Modelo = Modelo,
            this.Categoria_ID = Categoria_ID,
            this.Descripcion = Descripcion,
            this.Imagenes = Imagenes,
            this.Atributos = Atributos,
            this.Precio_Actual = Precio_Actual,
            this.Impuestos = Impuestos,
            this.Garantia = Garantia,
            this.Activo = Activo,
            this.Created_at = Created_at,
            this.Updated_at = Updated_at
    }

    static async obtenerTodos() {
        const [rows] = await db.query(`
            SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p 
            LEFT JOIN categorias c ON p.categoria_id = c.id 
            ORDER BY p.created_at DESC
        `);
        return rows;
    }

    static async obtenerPorId(id) {
        const [rows] = await db.query(`
            SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p 
            LEFT JOIN categorias c ON p.categoria_id = c.id 
            WHERE p.id = ?
        `, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async obtenerPorSKU(sku) {
        const [rows] = await db.query("SELECT * FROM productos WHERE sku = ?", [sku]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async obtenerPorCategoria(categoriaId) {
        const [rows] = await db.query(`
            SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p 
            LEFT JOIN categorias c ON p.categoria_id = c.id 
            WHERE p.categoria_id = ? AND p.activo = 1
            ORDER BY p.nombre
        `, [categoriaId]);
        return rows;
    }

    static async obtenerActivos() {
        const [rows] = await db.query(`
            SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p 
            LEFT JOIN categorias c ON p.categoria_id = c.id 
            WHERE p.activo = 1 
            ORDER BY p.nombre
        `);
        return rows;
    }

    static async crear(data) {
        const {
            SKU, Nombre, Marca, Modelo, Categoria_ID, Descripcion,
            Imagenes, Atributos, Precio_Actual, Impuestos, Garantia, Activo = 1
        } = data;

        const [result] = await db.query(
            `INSERT INTO productos 
            (sku, nombre, marca, modelo, categoria_id, descripcion, imagenes, atributos, precio_actual, impuestos, garantia, activo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [SKU, Nombre, Marca, Modelo, Categoria_ID, Descripcion,
                JSON.stringify(Imagenes), JSON.stringify(Atributos),
                Precio_Actual, JSON.stringify(Impuestos), Garantia, Activo]
        );

        return result.insertId;
    }

    static async eliminar(id) {
        const [result] = await db.query('DELETE FROM productos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async actualizar(id, data) {
        // Convertir campos JSON si están presentes
        const camposActualizados = { ...data };

        if (camposActualizados.Imagenes) {
            camposActualizados.imagenes = JSON.stringify(camposActualizados.Imagenes);
            delete camposActualizados.Imagenes;
        }

        if (camposActualizados.Atributos) {
            camposActualizados.atributos = JSON.stringify(camposActualizados.Atributos);
            delete camposActualizados.Atributos;
        }

        if (camposActualizados.Impuestos) {
            camposActualizados.impuestos = JSON.stringify(camposActualizados.Impuestos);
            delete camposActualizados.Impuestos;
        }

        const campos = Object.keys(camposActualizados);
        if (campos.length === 0) return false;

        const columnas = campos.map(campo => `${campo} = ?`).join(", ");
        const valores = Object.values(camposActualizados);

        const [result] = await db.query(
            `UPDATE productos SET ${columnas} WHERE id = ?`,
            [...valores, id]
        );

        return result.affectedRows > 0;
    }

    static async skuEnUsoPorOtroProducto(sku, id) {
        const [rows] = await db.query(
            "SELECT id FROM productos WHERE sku = ? AND id != ?",
            [sku, id]
        );
        return rows.length > 0;
    }

    static async buscarProductos(termino) {
        const [rows] = await db.query(`
            SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p 
            LEFT JOIN categorias c ON p.categoria_id = c.id 
            WHERE (p.nombre LIKE ? OR p.descripcion LIKE ? OR p.marca LIKE ? OR p.sku LIKE ?)
            AND p.activo = 1
            ORDER BY p.nombre
        `, [`%${termino}%`, `%${termino}%`, `%${termino}%`, `%${termino}%`]);
        return rows;
    }

    static async actualizarStock(id, cantidad) {
        // Este método sería útil si tuvieras un campo stock
        const [result] = await db.query(
            'UPDATE productos SET stock = stock + ? WHERE id = ?',
            [cantidad, id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Productos;