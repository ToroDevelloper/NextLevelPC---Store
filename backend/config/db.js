const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nextlevel',
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10
};

const db = mysql.createPool(dbConfig);

// Probar conexión
const testConnection = async () => {
    try {
        const connection = await db.getConnection();
        console.log('✅ Conexión a MySQL establecida correctamente');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Error conectando a MySQL:', error.message);
        console.log('📋 Configuración usada:');
        console.log('   Host:', dbConfig.host);
        console.log('   Database:', dbConfig.database);
        console.log('   User:', dbConfig.user);
        return false;
    }
};

module.exports = { db, testConnection };