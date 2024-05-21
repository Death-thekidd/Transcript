// src/routes/walletTransactionRoutes.ts
import { Router } from "express";
import * as walletTransactionController from "../controllers/walletTransaction.controller";

const router = Router();

router.get(
	"/wallet-transactions",
	walletTransactionController.getWalletTransactions
);
router.get(
	"/wallet-transaction/:id",
	walletTransactionController.getWalletTransaction
);

export default router;
