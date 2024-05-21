// src/controllers/walletTransactionController.ts
import { Request, Response, NextFunction } from "express";
import * as walletTransactionService from "../services/walletTransaction.service";

/**
 * Get all WalletTransactions
 * @route GET /wallet-transactions
 */
export const getWalletTransactions = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const walletTransactions =
			await walletTransactionService.getAllWalletTransactions();
		return res.status(200).json({ data: walletTransactions });
	} catch (error) {
		next(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

/**
 * Get Wallet Transaction by id
 * @route GET /wallet-transaction/:id
 */
export const getWalletTransaction = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const id = req.params.id;
		const walletTransaction =
			await walletTransactionService.getWalletTransactionById(id);

		if (!walletTransaction) {
			return res.status(404).json({ message: "Wallet Transaction not found" });
		}

		return res.status(200).json({ data: walletTransaction });
	} catch (error) {
		next(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};
