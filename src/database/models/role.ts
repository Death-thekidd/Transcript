import { Model, DataTypes, Identifier } from "sequelize";
import connection from "../connection";
import Privilege, { PrivilegeAttributes } from "./privilege";

export interface RoleAttributes {
	id?: Identifier;
	name: string;
	updatedAt?: Date;
	deletedAt?: Date;
	createdAt?: Date;
}
class Role extends Model<RoleAttributes> implements RoleAttributes {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	public id!: Identifier;
	public name!: string;
	public readonly updatedAt!: Date;
	public readonly createdAt!: Date;
	getPrivileges: () => Promise<PrivilegeAttributes[]>;
	addPrivilege: (privilege: PrivilegeAttributes) => Promise<any>;
	removePrivileges: () => Promise<any>;
	Privileges: PrivilegeAttributes[];
}
Role.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
		},
		name: { type: DataTypes.STRING, allowNull: false, unique: true },
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
		modelName: "Role",
	}
);

Role.belongsToMany(Privilege, {
	through: "RolePrivileges",
});

Privilege.belongsToMany(Role, {
	through: "RolePrivileges",
});

export default Role;
