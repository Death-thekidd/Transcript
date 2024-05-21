import { Model, DataTypes, Identifier } from "sequelize";
import connection from "../connection";

interface UserRoleAttributes {
	userId?: Identifier;
	roleId: Identifier;
	updatedAt?: Date;
	createdAt?: Date;
}

class UserRole extends Model<UserRoleAttributes> implements UserRoleAttributes {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	public userId: Identifier;
	public roleId: Identifier;
	public readonly updatedAt!: Date;
	public readonly createdAt!: Date;
}
UserRole.init(
	{
		userId: DataTypes.UUID,
		roleId: DataTypes.UUID,
	},
	{
		sequelize: connection,
		modelName: "UserRole",
	}
);
export default UserRole;
