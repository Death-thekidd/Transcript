import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../sequelize";
import { User } from "./user.model";
import { College } from "./college.model";
import { Destination } from "./destination.model";

export interface DepartmentDocument {
	id: string;
	name: string;
	collegeId: string;
}

export interface DepartmentInstance
	extends Model<DepartmentDocument>,
		DepartmentDocument {
	
}

export const initDepartmentModel = (sequelize: Sequelize) => {
	const Department = sequelize.define<DepartmentInstance>("Department", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
		},
		name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
		collegeId: {
			type: DataTypes.UUID,
			allowNull: false,
			unique: false,
		},
	});

	return Department;
};

export const Department = initDepartmentModel(sequelize);

export async function init() {
	try {
		await Department.sequelize.sync();
		// console.log("Database and tables synced successfully");
	} catch (error) {
		console.error("Error syncing database:", error);
	}
}
