import { Model, DataTypes, Identifier } from "sequelize";
import connection from "../connection";

interface RolePrivilegeAttributes {
	id?: Identifier;
	roleId?: Identifier;
	privilegeId?: Identifier;
	updatedAt?: Date;
	createdAt?: Date;
}

class RolePrivilege
	extends Model<RolePrivilegeAttributes>
	implements RolePrivilegeAttributes
{
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	public roleId: Identifier;
	public privilegeId: Identifier;
	public readonly updatedAt!: Date;
	public readonly createdAt!: Date;
}
RolePrivilege.init(
	{
		roleId: DataTypes.UUID,
		privilegeId: DataTypes.UUID,
	},
	{
		sequelize: connection,
		modelName: "RolePrivilege",
	}
);
export default RolePrivilege;
