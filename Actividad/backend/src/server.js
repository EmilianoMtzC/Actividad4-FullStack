import express from "express";
import { pool } from "./config/db.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API funcionando");
});

const startServer = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Conectado a la base de datos 🚀");
        connection.release();

        app.listen(3000, () => {
            console.log("Servidor corriendo en puerto http://localhost:3000");
        });

    } catch (error) {
        console.error("Error conectando a la base:", error);
    }
};

startServer();
