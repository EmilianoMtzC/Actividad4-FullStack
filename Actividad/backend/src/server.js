// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import auth from './middlewares/auth.js';
import transactionsRoutes from "./routes/transaction.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Railway necesita process.env.PORT

// ================================================================
// MIDDLEWARES
// ================================================================
app.use(cors());
app.use(express.json());

// ================================================================
// RUTAS
// ================================================================
app.get("/", (req, res) => {
    res.send("API funcionando 🚀");
});

// Rutas de Login y Registro
app.use("/api/auth", authRoutes);

app.use("/api/transactions", transactionsRoutes);

// Ruta protegida (corregida de 'router' a 'app')
app.get("/api/mis-transacciones", auth, async (req, res) => {
    try {
        // Obtenemos transacciones de la base de datos para el usuario del token
        const [rows] = await pool.query("SELECT * FROM transactions WHERE user_id = ?", [req.user.userId]);
        res.json({
            msg: `Hola ${req.user.name || 'Usuario'}, aquí están tus datos.`,
            data: rows
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener transacciones" });
    }
});

// ================================================================
// INICIO DEL SERVIDOR
// ================================================================
const startServer = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Conectado a la base de datos en Railway");
        connection.release();

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Error crítico al iniciar:", error.message);
        process.exit(1);
    }
};

startServer();