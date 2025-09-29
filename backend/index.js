const express = require('express');
const cors = require('cors');
const path = require('path');

// Cargar variables de entorno
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Importar rutas
const categoriasRoutes = require('./routes/categorias');
const serviciosRoutes = require('./routes/servicios'); // Nueva ruta

// Importar conexión a DB
const { testConnection } = require('./config/db');

const app = express();

// Middlewares
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (Object.keys(req.body).length > 0) {
        console.log('📦 Body:', req.body);
    }
    next();
});

// Rutas
app.use('/api/categorias', categoriasRoutes);
app.use('/api/servicios', serviciosRoutes); // Nueva ruta

// Ruta de salud
app.get('/api/health', async (req, res) => {
    try {
        const dbStatus = await testConnection();
        res.json({
            status: 'OK',
            message: 'Backend de NextLevelPC funcionando',
            database: dbStatus ? 'Conectado' : 'Desconectado',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development'
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'Error en el servidor',
            database: 'Error',
            timestamp: new Date().toISOString()
        });
    }
});

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenido a NextLevelPC Backend API',
        version: '1.0.0',
        endpoints: {
            categorias: '/api/categorias',
            servicios: '/api/servicios', // Nuevo endpoint
            health: '/api/health'
        }
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error del servidor:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

// Ruta no encontrada
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Inicializar servidor
const PORT = process.env.BACKEND_PORT || 8080;

const startServer = async () => {
    try {
        console.log('🔍 Verificando conexión a la base de datos...');
        const dbConnected = await testConnection();

        if (!dbConnected) {
            console.log('❌ No se pudo conectar a la base de datos');
            process.exit(1);
        }

        app.listen(PORT, () => {
            console.log('=====================================');
            console.log('🚀  BACKEND NEXTLEVELPC INICIADO');
            console.log('=====================================');
            console.log(`📍  Puerto: ${PORT}`);
            console.log(`🌐  URL: http://localhost:${PORT}`);
            console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
            console.log('📋 Endpoints disponibles:');
            console.log(`   📂 Categorias: http://localhost:${PORT}/api/categorias`);
            console.log(`   🔧 Servicios: http://localhost:${PORT}/api/servicios`);
            console.log('=====================================');
        });

    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();