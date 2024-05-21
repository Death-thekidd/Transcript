import { Model, DataTypes, Identifier } from "sequelize";
import connection from "../connection";

export interface PrivilegeAttributes {
	id?: Identifier;
	name: string;
	path: string;
	updatedAt?: Date;
	deletedAt?: Date;
	createdAt?: Date;
}

class Privilege
	extends Model<PrivilegeAttributes>
	implements PrivilegeAttributes
{
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	public id!: Identifier;
	public name!: string;
	public path!: string;
	public readonly updatedAt!: Date;
	public readonly createdAt!: Date;
}
Privilege.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
		},
		name: { type: DataTypes.STRING, allowNull: false, unique: true },
		path: { type: DataTypes.STRING, allowNull: false, unique: true },
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
		modelName: "Privilege",
	}
);

export default Privilege;
