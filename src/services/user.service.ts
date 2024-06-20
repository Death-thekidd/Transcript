// src/services/userService.ts
import User from "../database/models/user";
import Role from "../database/models/role";
import bcrypt from "bcrypt-nodejs";
import { Identifier } from "sequelize";
import College from "../database/models/college";
import Department from "../database/models/department";

interface userData extends User {
	college: Identifier;
	department: Identifier;
	roles: string[];
}

export const getAllUsers = async (): Promise<User[]> => {
	return await User.findAll({ include: [Role, College, Department] });
};

export const getUserById = async (id: string): Promise<User | null> => {
	return await User.findByPk(id, { include: [Role, College, Department] });
};

export const updateUser = async (
	userId: string,
	userData: userData
): Promise<void> => {
	const user = await User.findOne({ where: { id: userId } });

	if (!user) {
		throw new Error("User not found");
	}

	if (userData.password) {
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(userData.password, salt);
		user.password = hashedPassword;
	}

	user.email = userData.email || user.email;
	user.name = userData.name || user.name;
	user.departmentId = userData.department || user.departmentId;
	user.collegeId = userData.college || user.collegeId;

	await user.save();

	if (userData.roles) {
		const newRoles = userData.roles;
		const currentRoles = await user.getRoles();

		for (const currentRole of currentRoles) {
			if (!newRoles.includes(currentRole.name)) {
				await user.removeRole(currentRole);
			}
		}

		for (const role of newRoles) {
			const defaultRole = await Role.findOne({ where: { name: role } });
			if (defaultRole) {
				const hasRole = currentRoles.some(
					(currentRole) => currentRole.name === role
				);
				if (!hasRole) {
					await user.addRole(defaultRole);
				}
			}
		}
	}
};

export const deleteUserById = async (id: string): Promise<void> => {
	const user = await User.findByPk(id);
	if (!user) {
		throw new Error("User not found");
	}
	await user.destroy();
};
