import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../sequelize";
import { User } from "./user.model";
import { Department, DepartmentInstance } from "./department.model";

export interface CollegeDocument {
	id: string;
	name: string;
}

export interface CollegeInstance
	extends Model<CollegeDocument>,
		CollegeDocument {
	Departments: DepartmentInstance[];
}

export const initCollegeModel = (sequelize: Sequelize) => {
	const College = sequelize.define<CollegeInstance>("College", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
		},
		name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
	});

	return College;
};

export const College = initCollegeModel(sequelize);

College.hasMany(Department, {
	foreignKey: "collegeId",
	onDelete: "CASCADE",
});

Department.belongsTo(College, {
	foreignKey: "collegeId",
	onDelete: "CASCADE",
});

export async function init() {
	try {
		await College.sequelize.sync();
		// console.log("Database and tables synced successfully");
	} catch (error) {
		console.error("Error syncing database:", error);
	}
}
