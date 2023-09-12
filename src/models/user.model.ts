import { DataTypes, Model, Sequelize } from "sequelize";
import bcrypt from "bcrypt-nodejs";
import sequelize from "../sequelize";
import { Wallet } from "./wallet.model";
import { WalletTransaction } from "./walletTransaction.model";
import { Transaction } from "./transaction.model";
import { Role, RoleInstance } from "./role.model";

// Define the UserType enum
export enum UserType {
	Student = "Student",
	Staff = "Staff",
}

export interface UserDocument {
	id?: string;
	username: string;
	password: string;
	email: string;
	name: string;
	userType: UserType;
	passwordResetToken: string | null;
	passwordResetExpires: Date | null;
}

export interface UserInstance extends Model<UserDocument>, UserDocument {
	comparePassword(
		candidatePassword: string,
		cb: (err: any, isMatch: any) => void
	): Promise<boolean>;
	getRoles(): Promise<RoleInstance[]>;
	addRole(role: RoleInstance): Promise<any>;
}

export interface AuthToken {
	accessToken: string;
	kind: string;
}

export const initUserModel = (sequelize: Sequelize) => {
	const User = sequelize.define<UserInstance>("User", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
		},
		username: { type: DataTypes.STRING, allowNull: false },
		password: { type: DataTypes.STRING, allowNull: false },
		email: { type: DataTypes.STRING, allowNull: false, unique: true },
		name: { type: DataTypes.STRING, allowNull: false },
		userType: { type: DataTypes.STRING, allowNull: false },
		passwordResetToken: { type: DataTypes.STRING },
		passwordResetExpires: { type: DataTypes.DATE },
	});

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

	return User;
};

export const User = initUserModel(sequelize);


User.hasOne(Wallet, { foreignKey: "UserID", as: "Wallet" });
Wallet.belongsTo(User, {
	foreignKey: "UserID",
	constraints: false,
	as: "User",
});

User.hasOne(Transaction, { foreignKey: "UserID", as: "Transaction" });
Transaction.belongsTo(User, {
	foreignKey: "UserID",
	constraints: false,
	as: "User",
});

User.hasOne(WalletTransaction, {
	foreignKey: "UserID",
	as: "WalletTransaction",
});
WalletTransaction.belongsTo(User, {
	foreignKey: "UserID",
	constraints: false,
	as: "User",
});

User.belongsToMany(Role, {
	through: "user_roles",
	foreignKey: "userId",
});

Role.belongsToMany(User, {
	through: "user_roles",
	foreignKey: "roleId",
});

export async function init() {
	try {
		await User.sequelize.sync();
		// console.log("Database and tables synced successfully");
	} catch (error) {
		console.error("Error syncing database:", error);
	}
}
