import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../sequelize";
import { Role } from "./role.model";

export interface PrivilegeDocument {
	id: string;
	name: string;
	path: string;
}

export interface PrivilegeInstance
	extends Model<PrivilegeDocument>,
		PrivilegeDocument {}

export const initPrivilegeModel = (sequelize: Sequelize) => {
	const Privilege = sequelize.define<PrivilegeInstance>("Privilege", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
		},
		name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
		path: { type: DataTypes.STRING(50), allowNull: false, unique: true },
	});

	return Privilege;
};

export const Privilege = initPrivilegeModel(sequelize);

export async function init() {
	try {
		await Privilege.sequelize.sync();
		// console.log("Database and tables synced successfully");
	} catch (error) {
		console.error("Error syncing database:", error);
	}
}
