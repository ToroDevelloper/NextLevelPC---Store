const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nextlevel', // Cambiado a nextlevel
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
};

const db = mysql.createPool(dbConfig);

// Probar conexión
const testConnection = async () => {
    try {
        const connection = await db.getConnection();
        console.log('✅ Conexión a MySQL establecida correctamente');
        console.log('📋 Base de datos:', dbConfig.database);
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Error conectando a MySQL:', error.message);
        console.log('📋 Configuración usada:');
        console.log('   Host:', dbConfig.host);
        console.log('   Database:', dbConfig.database);
        console.log('   User:', dbConfig.user);

        // Intentar conectar a la base de datos por defecto para crear la DB si no existe
        if (error.code === 'ER_BAD_DB_ERROR') {
            console.log('⚠️  La base de datos no existe. Intentando crear...');
            try {
                const tempConfig = { ...dbConfig, database: null };
                const tempPool = mysql.createPool(tempConfig);
                const tempConnection = await tempPool.getConnection();

                await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` DEFAULT CHARACTER SET = utf8mb4 DEFAULT COLLATE = utf8mb4_unicode_ci`);
                console.log(`✅ Base de datos '${dbConfig.database}' creada exitosamente`);

                tempConnection.release();
                tempPool.end();
                return true;
            } catch (createError) {
                console.error('❌ Error creando la base de datos:', createError.message);
            }
        }
        return false;
    }
};

// Función para ejecutar consultas con manejo de errores
const executeQuery = async (query, params = []) => {
    try {
        const [results] = await db.execute(query, params);
        return results;
    } catch (error) {
        console.error('❌ Error en consulta SQL:', error.message);
        console.error('📋 Query:', query);
        console.error('📋 Params:', params);
        throw error;
    }
};

// Función para obtener una conexión
const getConnection = async () => {
    return await db.getConnection();
};

module.exports = {
    db,
    testConnection,
    executeQuery,
    getConnection
};