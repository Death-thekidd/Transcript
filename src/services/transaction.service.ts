// src/services/transactionService.ts
import Transaction from "../database/models/transaction";

export async function getAllTransactions(): Promise<Transaction[]> {
	return await Transaction.findAll();
}

export async function getTransactionById(
	id: string
): Promise<Transaction | null> {
	return await Transaction.findByPk(id);
}
