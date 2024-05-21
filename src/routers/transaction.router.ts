// src/routes/transactionRoutes.ts
import { Router } from "express";
import { param } from "express-validator";
import * as transactionController from "../controllers/transaction.controller";

const router = Router();

router.get("/transactions", transactionController.getTransactions);

router.get(
	"/transaction/:id",
	param("id").isString().withMessage("Transaction ID must be a string"),
	transactionController.getTransaction
);

export default router;
