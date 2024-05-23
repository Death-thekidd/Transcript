import { Model, DataTypes, Identifier } from "sequelize";
import connection from "../connection";
import Transaction from "./transaction";
import Role, { RoleAttributes } from "./role";
import Wallet from "./wallet";
import College, { CollegeAttributes } from "./college";
import Department, { DepartmentAttributes } from "./department";
import bcrypt from "bcrypt-nodejs";

export interface UserAttributes {
	id?: Identifier;
	name: string;
	email: string;
	password: string;
	schoolId: string;
	isAdmin: boolean;
	collegeId: Identifier;
	departmentId: Identifier;
	resetToken: string;
	resetTokenExpires: Date;
	updatedAt?: Date;
	deletedAt?: Date;
	createdAt?: Date;
}
class User extends Model<UserAttributes> implements UserAttributes {
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	public id!: Identifier;
	public name!: string;
	public email!: string;
	public password!: string;
	public isAdmin: boolean;
	public schoolId: string;
	public collegeId: Identifier;
	public departmentId: Identifier;
	public resetToken: string;
	public resetTokenExpires: Date;
	public readonly updatedAt!: Date;
	public readonly createdAt!: Date;
	comparePassword: (
		candidatePassword: string,
		cb: (err: any, isMatch: any) => void
	) => Promise<void>;
	getRoles: () => Promise<Role[]>;
	addRole: (role: RoleAttributes) => Promise<any>;
	removeRole: (role: RoleAttributes) => Promise<any>;
	College: CollegeAttributes;
	Department: DepartmentAttributes;
}
User.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
		},
		schoolId: DataTypes.STRING,
		collegeId: DataTypes.UUID,
		departmentId: DataTypes.UUID,
		password: DataTypes.STRING,
		email: DataTypes.STRING,
		name: DataTypes.STRING,
		isAdmin: DataTypes.BOOLEAN,
		resetToken: DataTypes.STRING,
		resetTokenExpires: DataTypes.DATE,
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
		modelName: "User",
	}
);

// Password hash middleware
User.beforeCreate(async (user) => {
	if (user.password) {
		const salt = bcrypt.genSaltSync(10);
		user.password = bcrypt.hashSync(user.password, salt);
	}
});

// Method to compare passwords
User.prototype.comparePassword = async function (
	candidatePassword: string,
	cb: (err: any, isMatch: any) => void
) {
	cb(undefined, bcrypt.compareSync(candidatePassword, this.password));
};

User.hasMany(Transaction, { foreignKey: "userId" });
Transaction.belongsTo(User, {
	foreignKey: "userId",
});

College.hasMany(User, { foreignKey: "collegeId" });
User.belongsTo(College, {
	foreignKey: "collegeId",
});
Department.hasMany(User, { foreignKey: "departmentId" });
User.belongsTo(Department, {
	foreignKey: "departmentId",
});

User.belongsToMany(Role, {
	through: "UserRole",
});

Role.belongsToMany(User, {
	through: "UserRole",
});

User.hasOne(Wallet, { foreignKey: "userId" });
Wallet.belongsTo(User, {
	foreignKey: "userId",
});

export default User;
