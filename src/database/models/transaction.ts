import { Model, DataTypes, Identifier } from "sequelize";
import connection from "../connection";
import User from "./user";

enum CurrencyType {
	NGN = "NGN",
}

enum GatewayType {
	PAYSTACK = "paystack",
}

interface TransactionAttributes {
	id?: Identifier;
	userId?: Identifier;
	transactionId?: number;
	name: string;
	email: string;
	amount: number;
	currency: string;
	paymentStatus: string;
	paymentGateway: string;
	updatedAt?: Date;
	deletedAt?: Date;
	createdAt?: Date;
}

class Transaction
	extends Model<TransactionAttributes>
	implements TransactionAttributes
{
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	public id!: Identifier;
	public name!: string;
	public userId?: Identifier;
	public User: User;
	public transactionId?: number;
	public email: string;
	public amount: number;
	public currency: string;
	public paymentStatus: string;
	public paymentGateway: string;
	public readonly updatedAt!: Date;
	public readonly createdAt!: Date;
}
Transaction.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		userId: DataTypes.UUID,
		name: { type: DataTypes.STRING, allowNull: false },
		email: { type: DataTypes.STRING, allowNull: false },
		amount: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
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
			type: DataTypes.DATE,
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE,
		},
	},
	{
		sequelize: connection,
		modelName: "Transaction",
	}
);
export default Transaction;
