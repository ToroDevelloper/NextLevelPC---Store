const jwt = require('jsonwebtoken');

const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'fallback_access_key');
            req.usuario = decoded;

            if (rolesPermitidos.includes(decoded.rol)) {
                next();
            } else {
                res.status(403).json({ message: 'Acceso prohibido. No tienes los permisos necesarios.' });
            }
        } catch (error) {
            res.status(400).json({ message: 'Token inválido.' });
        }
    };
};

module.exports = { verificarRol };
