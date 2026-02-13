import {
    createTransaction,
    getTransactionsByUserId,
    deleteTransaction
} from '../models/transaction.model.js';

export const createTransactionController = async (req, res) => {
    try {
        const user_id = req.user.id || req.user.userId;
        const { type, category, amount, description, date } = req.body;

        // LOG para ver qué estamos enviando
        console.log("Enviando a DB:", { user_id, type, category, amount, description, date });

        const id = await createTransaction({
            user_id, type, category, amount, description, date
        });

        res.status(201).json({ id });
    } catch (error) {
        // ESTA LÍNEA ES CLAVE: Mira tu consola de WebStorm ahora
        console.error("ERROR REAL DE MYSQL:", error.sqlMessage || error.message);

        res.status(500).json({ message: "Error creating transaction", details: error.sqlMessage });
    }
};

export const getTransactionsController = async (req, res) => {
    try {
        const user_id = req.user.id || req.user.userId;

        // CORRECCIÓN: Usar el nombre que importaste arriba
        const transactions = await getTransactionsByUserId(user_id);

        res.json(transactions);
    } catch (error) {
        console.error("DEBUG - Error en Fetch:", error.message);
        res.status(500).json({ message: "Error fetching transactions" });
    }
};

export const deleteTransactionController = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id || req.user.userId;

        const deleted = await deleteTransaction(id, user_id);

        if (!deleted) {
            return res.status(404).json({ message: "Transacción no encontrada o no autorizada" });
        }

        res.json({ message: "Transacción eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la transacción" });
    }
};