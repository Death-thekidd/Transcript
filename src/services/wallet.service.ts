// src/services/walletService.ts
import crypto from "crypto";
import Wallet from "../database/models/wallet";
import WalletTransaction from "../database/models/wallettransaction";
import Transaction from "../database/models/transaction";
import User from "../database/models/user";
import { PAYSTACK_SECRET_KEY } from "../util/secrets";
import { Identifier } from "sequelize";
import { TransactionType } from "../database/migrations/20240510092110-create-wallet-transaction";

enum CurrencyType {
	NGN = "NGN",
}

enum GatewayType {
	PAYSTACK = "paystack",
}

export const getAllWallets = async (): Promise<Wallet[]> => {
	return await Wallet.findAll();
};

export const getWalletByUserId = async (
	userID: Identifier
): Promise<Wallet | null> => {
	return await Wallet.findOne({ where: { userId: userID } });
};

export const verifyPaystackSignature = (
	reqBody: Request,
	signature: string
): boolean => {
	const hash = crypto
		.createHmac("sha512", PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(reqBody))
		.digest("hex");
	return hash === signature;
};

export const processPaystackEvent = async (event: {
	event: string;
	data: {
		status: string;
		currency: CurrencyType;
		id: number;
		amount: number;
		customer: { name: string; email: string };
	};
}): Promise<Wallet> => {
	if (event && event.event === "charge.success") {
		const { status, currency, id, amount, customer } = event.data;

		const transactionExist = await Transaction.findOne({
			where: { transactionId: id },
		});

		if (transactionExist) {
			throw new Error("Transaction Already Exists");
		}

		const user = await User.findOne({ where: { email: customer.email } });
		if (!user) {
			throw new Error("User not found");
		}

		const wallet = await validateUserWallet(user.id);
		await createWalletTransaction(
			wallet.id,
			status,
			currency,
			amount,
			TransactionType.DEPOSIT
		);
		await createTransaction(user.id, id, status, currency, amount, customer);
		await updateWalletBalance(user.id, amount);

		return wallet;
	}
	throw new Error("Invalid event");
};

const validateUserWallet = async (userId: Identifier): Promise<Wallet> => {
	let userWallet = await Wallet.findOne({ where: { userId } });
	if (!userWallet) {
		userWallet = await Wallet.create({ userId });
	}
	return userWallet;
};

const createWalletTransaction = async (
	walletId: Identifier,
	status: string,
	currency: CurrencyType,
	amount: number,
	type: TransactionType
): Promise<WalletTransaction> => {
	return await WalletTransaction.create({
		amount,
		walletId,
		currency,
		status,
		isInFlow: true,
		transactionType: type,
	});
};

const createTransaction = async (
	userId: Identifier,
	id: number,
	status: string,
	currency: CurrencyType,
	amount: number,
	customer: { name: string; email: string }
): Promise<Transaction> => {
	return await Transaction.create({
		userId,
		transactionId: id,
		name: customer.name,
		email: customer.email,
		amount,
		currency,
		paymentStatus: status,
		paymentGateway: GatewayType.PAYSTACK,
	});
};

const updateWalletBalance = async (
	userId: Identifier,
	amount: number
): Promise<Wallet> => {
	const wallet = await Wallet.findOne({ where: { userId } });
	if (wallet) {
		wallet.balance += amount;
		await wallet.save();
		return wallet;
	}
	throw new Error("Wallet not found");
};
