"use strict";
import { QueryInterface, DataTypes } from "sequelize";
/** @type {import('sequelize-cli').Migration} */

enum CurrencyType {
	NGN = "NGN",
}

enum GatewayType {
	PAYSTACK = "paystack",
}

module.exports = {
	async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
		await queryInterface.createTable("Transactions", {
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			userId: {
				type: Sequelize.UUID,
				allowNull: false,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			amount: {
				type: Sequelize.FLOAT,
				allowNull: false,
			},
			currency: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: CurrencyType.NGN,
			},
			paymentStatus: { type: DataTypes.STRING, allowNull: false },
			paymentGateway: {
				type: DataTypes.STRING,
				defaultValue: GatewayType.PAYSTACK,
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
		await queryInterface.dropTable("Transactions");
	},
};
