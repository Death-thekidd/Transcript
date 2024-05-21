import { Model, DataTypes, Identifier } from "sequelize";
import connection from "../connection";

export interface DepartmentAttributes {
	id?: Identifier;
	name: string;
	collegeId: Identifier;
	updatedAt?: Date;
	deletedAt?: Date;
	createdAt?: Date;
}

class Department
	extends Model<DepartmentAttributes>
	implements DepartmentAttributes
{
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	public id!: Identifier;
	public name!: string;
	public dataValues: DepartmentAttributes;
	public collegeId!: Identifier;
	public readonly updatedAt!: Date;
	public readonly createdAt!: Date;
}
Department.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
		},
		name: { type: DataTypes.STRING, allowNull: false, unique: true },
		collegeId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
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
		modelName: "Department",
	}
);
export default Department;
