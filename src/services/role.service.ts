// src/services/roleService.ts
import Role from "../database/models/role";
import Privilege from "../database/models/privilege";
import { Identifier } from "sequelize";
import User from "../database/models/user";

type RoleResponse = {
	id: Identifier;
	name: string;
	privileges: string[];
};

export async function getAllRoles(): Promise<RoleResponse[]> {
	const roles = await Role.findAll({
		include: Privilege,
	});

	return roles.map((role) => ({
		id: role.id,
		name: role.name,
		privileges: role.Privileges.map((privilege) => privilege.name),
	}));
}

export async function getRoleById(
	roleId: number
): Promise<RoleResponse | null> {
	const role = await Role.findByPk(roleId, {
		include: Privilege,
	});

	if (!role) {
		return null;
	}

	return {
		id: role.id,
		name: role.name,
		privileges: role.Privileges.map((privilege) => privilege.name),
	};
}

export async function createRole(
	name: string,
	privileges: string[]
): Promise<RoleResponse> {
	const role = await Role.create({ name });

	await assignPrivilegesToRole(role, privileges);

	return {
		id: role.id,
		name: role.name,
		privileges,
	};
}

export async function updateRole(
	roleId: number,
	name: string,
	privileges: string[]
): Promise<RoleResponse | null> {
	const role = await Role.findByPk(roleId);

	if (!role) {
		return null;
	}

	role.name = name;
	await role.save();

	await assignPrivilegesToRole(role, privileges);

	return {
		id: role.id,
		name: role.name,
		privileges,
	};
}

export async function deleteRole(roleId: number): Promise<boolean> {
	const role = await Role.findByPk(roleId);

	if (!role) {
		return false;
	}

	await role.destroy();
	return true;
}

export async function addRoleToUser(
	userId: number,
	roleId: number
): Promise<boolean> {
	const user = await User.findByPk(userId);
	const role = await Role.findByPk(roleId);

	if (!user || !role) {
		return false;
	}

	await user.addRole(role);
	return true;
}

async function assignPrivilegesToRole(role: Role, privileges: string[]) {
	if (!role || !Array.isArray(privileges) || privileges.length === 0) {
		return;
	}

	await role.removePrivileges();

	for (const privilege of privileges) {
		const associatedPrivilege = await Privilege.findOne({
			where: { name: privilege },
		});
		if (associatedPrivilege) {
			await role.addPrivilege(associatedPrivilege);
		}
	}
}
