// ================================================================
// IMPORTACIÓN DE MODULOS
// ================================================================
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

// ================================================================
// ======== CONFIGURACIÓN =========================================
// ================================================================

const router = express.Router(); // <--- Solo declaramos 'router' UNA VEZ
const JWT_SECRET = process.env.JWT_SECRET || "gokussj1";

// REGISTRAR USUARIO =========================================================
router.post("/register", async (req, res) => { // Añadimos 'async'
    const { name, email, password } = req.body;

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

        const [result] = await db.query(sql, [name, email, passwordHash]);

        res.status(201).json({ message: "Usuario registrado", userId: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: "El usuario ya existe" });
        }
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// LOGGEAR USUARIO =========================================================
router.post("/login", async (req, res) => { // Añadimos 'async'
    const { username, password } = req.body;

    try {
        const sql = "SELECT * FROM users WHERE email = ?";
        const [rows] = await db.query(sql, [username]);
        const user = rows[0];

        if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) return res.status(401).json({ error: "Credenciales incorrectas" });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login correcto", token });
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});

export default router;