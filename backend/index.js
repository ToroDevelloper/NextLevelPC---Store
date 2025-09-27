const express = require('express');
const cors = require('cors');
const path = require('path');

// Cargar variables de entorno
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Importar rutas
const categoriasRoutes = require('./routes/categorias');

const app = express();

// Middlewares
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Rutas
app.use('/api/categorias', categoriasRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Backend de NextLevelPC funcionando',
        timestamp: new Date().toISOString()
    });
});

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenido a NextLevelPC Backend API',
        version: '1.0.0',
        endpoints: {
            categorias: '/api/categorias',
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

app.listen(PORT, () => {
    console.log('=====================================');
    console.log('🚀  BACKEND NEXTLEVELPC INICIADO');
    console.log('=====================================');
    console.log(`📍  Puerto: ${PORT}`);
    console.log(`🌐  URL: http://localhost:${PORT}`);
    console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
    console.log('=====================================');
});