// src/controllers/walletController.ts
import { Request, Response, NextFunction } from "express";
import * as walletService from "../services/wallet.service";

/**
 * Get all Wallets
 * @route GET /wallets
 */
export const getWallets = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const wallets = await walletService.getAllWallets();
		return res.status(200).json({ data: wallets });
	} catch (error) {
		next(error);
	}
};

/**
 * Get Wallet by UserID
 * @route GET /wallet/:id
 */
export const getWallet = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const userID = req.params.id;
		const wallet = await walletService.getWalletByUserId(userID);

		if (!wallet) {
			return res.status(404).json({ message: "Wallet not found" });
		}

		return res.status(200).json({ data: wallet });
	} catch (error) {
		next(error);
	}
};

/**
 * Paystack webhook url
 * @route POST /verify-transaction
 */
export const verifyPayment = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const isValid = walletService.verifyPaystackSignature(
			req.body,
			req.headers["x-paystack-signature"] as string
		);
		if (!isValid) {
			return res.status(400).json({ message: "Invalid signature" });
		}

		const wallet = await walletService.processPaystackEvent(req.body);
		return res
			.status(200)
			.json({ message: "Wallet funded successfully", data: wallet });
	} catch (error) {
		if (error.message === "Transaction Already Exists") {
			return res.status(409).json({ message: error.message });
		}
		next(error);
	}
};
