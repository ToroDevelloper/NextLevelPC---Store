const express = require('express');
const db = require('./main/config/db.js');
const usuariosRoutes = require('./main/routes/UsuariosRoutes.js')

const app = express();
app.use(express.json());

app.use('/api',usuariosRoutes)

const port = 8080;
app.listen(port,()=>{
    console.log('server en port '+ port)
})


