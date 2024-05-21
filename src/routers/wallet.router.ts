// src/routes/walletRoutes.ts
import { Router } from "express";
import * as walletController from "../controllers/wallet.controller";

const router = Router();

router.get("/wallets", walletController.getWallets);
router.get("/wallet/:id", walletController.getWallet);
router.post("/verify-transaction", walletController.verifyPayment);

export default router;
