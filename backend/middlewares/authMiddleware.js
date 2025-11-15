const jwt = require('jsonwebtoken');

function verificarToken(){
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'fallback_access_key');
            req.usuario = decoded;

        next();
        } catch (error) {
            res.status(400).json({ message: 'Token inválido.' });
        }
    };
};

module.exports = verificarToken;
