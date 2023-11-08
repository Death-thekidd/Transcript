import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../sequelize";
import { User } from "./user.model";
import { Privilege, PrivilegeInstance } from "./privilege.model";

export interface RoleDocument {
	id: string;
	name: string;
}

export interface RoleInstance extends Model<RoleDocument>, RoleDocument {
	getPrivileges(): Promise<PrivilegeInstance[]>;
	addPrivilege(privilege: PrivilegeInstance): Promise<any>;
	removePrivileges(): Promise<any>;
}

export const initRoleModel = (sequelize: Sequelize) => {
	const Role = sequelize.define<RoleInstance>("Role", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
		},
		name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
	});

	return Role;
};

export const Role = initRoleModel(sequelize);

Role.belongsToMany(Privilege, {
	through: "role_privileges",
	foreignKey: "roleId",
});

Privilege.belongsToMany(Role, {
	through: "role_privileges",
	foreignKey: "privilegeId",
});

export async function init() {
	try {
		await Role.sequelize.sync();
		// console.log("Database and tables synced successfully");
	} catch (error) {
		console.error("Error syncing database:", error);
	}
}
