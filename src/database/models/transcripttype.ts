import { Model, DataTypes, Identifier } from "sequelize";
import connection from "../connection";

export interface TranscriptTypeAttributes {
	id?: Identifier;
	name?: string;
	amount?: number;
	updatedAt?: Date;
	createdAt?: Date;
}

class TranscriptType
	extends Model<TranscriptTypeAttributes>
	implements TranscriptTypeAttributes
{
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	public id!: Identifier;
	public name: string;
	public amount: number;
	public readonly updatedAt!: Date;
	public readonly createdAt!: Date;
}
TranscriptType.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
		},
		name: DataTypes.STRING,
		amount: DataTypes.FLOAT,
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
		modelName: "TranscriptType",
	}
);
export default TranscriptType;
