import { QueryInterface, DataTypes } from "sequelize";

export enum TransactionType {
	DEPOSIT = "deposit",
	PAYMENT = "payment",
}

enum CurrencyType {
	NGN = "NGN",
}

enum GatewayType {
	PAYSTACK = "paystack",
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
		await queryInterface.createTable("WalletTransactions", {
			id: {
				allowNull: false,
				autoIncrement: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
			},
			amount: {
				type: Sequelize.FLOAT,
				allowNull: false,
				defaultValue: 0,
			},
			walletId: {
				type: Sequelize.UUID,
			},
			isInFlow: {
				type: Sequelize.BOOLEAN,
			},
			paymentMethod: {
				type: Sequelize.STRING,
				defaultValue: GatewayType.PAYSTACK,
			},
			currency: {
				type: Sequelize.STRING,
				defaultValue: CurrencyType.NGN,
			},
			status: {
				type: Sequelize.STRING,
			},
			transactionType: {
				type: Sequelize.STRING,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface: QueryInterface) {
		await queryInterface.dropTable("WalletTransactions");
	},
};
