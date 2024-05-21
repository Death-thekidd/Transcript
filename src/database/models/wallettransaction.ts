import { Model, DataTypes, Identifier } from "sequelize";
import connection from "../connection";

interface WalletTransactionAttributes {
	id?: Identifier;
	walletId?: Identifier;
	amount: number;
	isInFlow: boolean;
	paymentMethod: string;
	currency: string;
	status: string;
	transactionType: string;
	updatedAt?: Date;
	createdAt?: Date;
}
class WalletTransaction
	extends Model<WalletTransactionAttributes>
	implements WalletTransactionAttributes
{
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	public id?: Identifier;
	public walletId?: Identifier;
	public amount: number;
	public isInFlow: boolean;
	public paymentMethod: string;
	public currency: string;
	public status: string;
	public transactionType: string;
	public updatedAt?: Date;
	public createdAt?: Date;
}
WalletTransaction.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
		},
		amount: DataTypes.FLOAT,
		walletId: DataTypes.UUID,
		isInFlow: DataTypes.BOOLEAN,
		paymentMethod: DataTypes.STRING,
		currency: DataTypes.STRING,
		status: DataTypes.STRING,
		transactionType: DataTypes.STRING,
	},
	{
		sequelize: connection,
		modelName: "WalletTransaction",
	}
);
export default WalletTransaction;
