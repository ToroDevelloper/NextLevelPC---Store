const express = require('express');
const db = require('./main/config/db.js');
const usuariosRoutes = require('./main/routes/UsuariosRoutes.js')

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/api',usuariosRoutes);

app.use((err, req, res, next) => {
    console.error('Error detectado:', err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});

const rolesRoutes = require('./main/routes/RolesRoutes.js');
app.use('/api', rolesRoutes);

const productosRoutes = require('./routes/productos');
app.use('/api/productos', productosRoutes);

const port = 8080;
app.listen(port,()=>{
    console.log('server en port '+ port)
})


