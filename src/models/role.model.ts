import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../sequelize";
import { User } from "./user.model";

export interface RoleDocument {
	id: string;
	name: string;
}

export interface RoleInstance extends Model<RoleDocument>, RoleDocument {}

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

export async function init() {
	try {
		await Role.sequelize.sync();
		// console.log("Database and tables synced successfully");
	} catch (error) {
		console.error("Error syncing database:", error);
	}
}
