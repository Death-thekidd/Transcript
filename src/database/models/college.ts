import { Model, DataTypes, Identifier } from "sequelize";
import connection from "../connection";

import Department, { DepartmentAttributes } from "./department";

export interface CollegeAttributes {
	id?: Identifier;
	name: string;
	updatedAt?: Date;
	deletedAt?: Date;
	createdAt?: Date;
}
class College extends Model<CollegeAttributes> implements CollegeAttributes {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	public id!: Identifier;
	public name!: string;
	public Departments: [DepartmentAttributes];
	public readonly updatedAt!: Date;
	public readonly createdAt!: Date;
}
College.init(
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
		modelName: "College",
	}
);

College.hasMany(Department, {
	foreignKey: "collegeId",
	onDelete: "CASCADE",
});

Department.belongsTo(College, {
	foreignKey: "collegeId",
	onDelete: "CASCADE",
});

export default College;
