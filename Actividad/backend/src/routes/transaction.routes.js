import { Router } from "express";
import {
    createTransactionController,
    getTransactionsController,
    deleteTransactionController
} from "../controllers/transactions.controller.js";

import auth from "../middlewares/auth.js";

const router = Router();

router.post("/", auth, createTransactionController);
router.get("/", auth, getTransactionsController);
router.delete("/:id", auth, deleteTransactionController);

export default router;