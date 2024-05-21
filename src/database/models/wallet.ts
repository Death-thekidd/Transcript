import { Model, DataTypes, Identifier } from "sequelize";
import connection from "../connection";
import WalletTransaction from "./wallettransaction";

interface WalletAttributes {
	id?: Identifier;
	userId?: Identifier;
	balance: number;
	updatedAt?: Date;
	createdAt?: Date;
}

class Wallet extends Model<WalletAttributes> implements WalletAttributes {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	public id!: Identifier;
	public userId: Identifier;
	public balance: number;
	public readonly updatedAt!: Date;
	public readonly createdAt!: Date;
}
Wallet.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
		},
		userId: DataTypes.UUID,
		balance: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
	},
	{
		sequelize: connection,
		modelName: "Wallet",
	}
);

Wallet.hasMany(WalletTransaction, {
	foreignKey: "walletId",
});
WalletTransaction.belongsTo(Wallet, {
	foreignKey: "walletId",
});

export default Wallet;
