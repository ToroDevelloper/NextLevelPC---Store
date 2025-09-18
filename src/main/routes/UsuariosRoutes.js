const express = require('express')
const db = require('../config/db.js')

const router = express.Router();

router.get('/usuarios',async(req,res)=>{
    try {
        const sql = 'SELECT * FROM usuarios;';
        const [rows] = await db.query(sql);
        res.json(rows)
    } catch (error) {
        console.error('Error al obtener usuarios',error);
        res.status(500).json({error:'Error en el server'})
    }
})

module.exports = router;
