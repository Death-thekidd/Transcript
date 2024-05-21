// src/controllers/transactionController.ts
import { Request, Response, NextFunction } from "express";
import * as transactionService from "../services/transaction.service";

/**
 * Get all WalletTransactions
 * @route GET /transactions
 */
export const getTransactions = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const transactions = await transactionService.getAllTransactions();
		return res.status(200).json({ data: transactions });
	} catch (error) {
		next(error);
	}
};

/**
 * Get Transaction by transaction ID
 * @route GET /transaction/:id
 */
export const getTransaction = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const id = req.params.id;
		const transaction = await transactionService.getTransactionById(id);

		if (!transaction) {
			return res.status(404).json({ message: "Transaction not found" });
		}

		return res.status(200).json({ data: transaction });
	} catch (error) {
		next(error);
	}
};
