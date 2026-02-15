import { pool } from '../config/db.js';

export const createTransaction = async (data) => {
    const { user_id, type, category, amount, description, date } = data;

    const [result] = await pool.query(
        "INSERT INTO transactions (user_id, type, category, amount, description, date) VALUES (?, ?, ?, ?, ?, ?)",
        [user_id, type, category, amount, description, date]
    );

    return result.insertId;
};

export const getTransactionsByUserId = async (user_id) => {
    const [rows] = await pool.query(
        "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC",
        [user_id]
    );
    return rows;
};

export const deleteTransaction = async (id, user_id) => {
    const [result] = await pool.query(
        "DELETE FROM transactions WHERE id = ? AND user_id = ?",
        [id, user_id]
    );
    return result.affectedRows > 0;
};