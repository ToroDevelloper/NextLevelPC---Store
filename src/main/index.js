const express = require('express');
const db = require('./main/db.js');

const app = express();
app.use(express.json());

const port = 8080;
app.listen(port,()=>{
    console.log('server en port '+ port)
})

//pag

