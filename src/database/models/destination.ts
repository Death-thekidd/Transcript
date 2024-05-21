import { Model, DataTypes, Identifier } from "sequelize";
import connection from "../connection";

export interface DestinationAttributes {
	id?: Identifier;
	name: string;
	deliveryMethod: string;
	rate: number;
	updatedAt?: Date;
	deletedAt?: Date;
	createdAt?: Date;
}

class Destination
	extends Model<DestinationAttributes>
	implements DestinationAttributes
{
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	public id!: Identifier;
	public name!: string;
	public deliveryMethod!: string;
	public rate!: number;
	public readonly updatedAt!: Date;
	public readonly createdAt!: Date;
}
Destination.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
		},
		name: { type: DataTypes.STRING, allowNull: false, unique: true },
		deliveryMethod: DataTypes.STRING,
		rate: DataTypes.FLOAT,
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
		modelName: "Destination",
	}
);
export default Destination;
