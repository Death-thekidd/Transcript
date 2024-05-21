// src/services/walletTransactionService.ts
import WalletTransaction from "../database/models/wallettransaction";
import { Identifier } from "sequelize";

export const getAllWalletTransactions = async (): Promise<
	WalletTransaction[]
> => {
	return await WalletTransaction.findAll();
};

export const getWalletTransactionById = async (
	id: Identifier
): Promise<WalletTransaction | null> => {
	return await WalletTransaction.findByPk(id);
};
