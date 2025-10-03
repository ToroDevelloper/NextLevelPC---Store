const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization']; 
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ mensaje: 'Token inválido o expirado' });
    }
}

module.exports = verificarToken;
