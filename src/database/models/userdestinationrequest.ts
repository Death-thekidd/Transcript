import { Model, DataTypes, Identifier } from "sequelize";
import connection from "../connection";

interface UserDestinationRequestAttributes {
	id?: Identifier;
	name?: string;
	userId?: Identifier;
	status: string;
	updatedAt?: Date;
	createdAt?: Date;
}

class UserDestinationRequest
	extends Model<UserDestinationRequestAttributes>
	implements UserDestinationRequestAttributes
{
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	public id!: Identifier;
	public name: string;
	public userId: Identifier;
	public status: string;
	public readonly updatedAt!: Date;
	public readonly createdAt!: Date;
}
UserDestinationRequest.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
		},
		name: DataTypes.STRING,
		userId: DataTypes.UUID,
		status: DataTypes.STRING,
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
		modelName: "UserDestinationRequest",
	}
);
export default UserDestinationRequest;
