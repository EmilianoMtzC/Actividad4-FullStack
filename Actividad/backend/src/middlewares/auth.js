import jwt from 'jsonwebtoken'; // Cambiado de require

const JWT_SECRET = process.env.JWT_SECRET || 'gokussj1';

export function auth(req, res, next) { // Cambiado a exportación de ES Modules
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);

        // Guardamos los datos del usuario (id, name) en el objeto req
        // para que las siguientes funciones puedan usarlos
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token invalido o expirado" });
    }
}

export default auth; // Exportación por defecto