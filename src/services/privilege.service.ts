// services/privilegeService.ts
import Privilege from "../database/models/privilege";
import Role from "../database/models/role";

export const getAllPrivileges = async (): Promise<Privilege[]> => {
	try {
		return await Privilege.findAll();
	} catch (error) {
		throw error;
	}
};

export const getPrivilegeById = async (
	privilegeId: string
): Promise<Privilege> => {
	try {
		const privilege = await Privilege.findByPk(privilegeId);
		if (!privilege) {
			throw new Error("Privilege not found");
		}
		return privilege;
	} catch (error) {
		throw error;
	}
};

export const createPrivilege = async (name: string): Promise<Privilege> => {
	try {
		return await Privilege.create({ name });
	} catch (error) {
		throw error;
	}
};

export const addPrivilegeToRole = async (
	roleName: string,
	assignedPrivileges: string[]
): Promise<void> => {
	try {
		const role = await Role.findOne({ where: { name: roleName } });
		if (!role) {
			throw new Error(`Role '${roleName}' not found.`);
		}

		// Remove all existing privileges associated with the role
		await role.removePrivileges();

		// Assign the specified privileges to the role
		for (const privilegeName of assignedPrivileges) {
			const associatedPrivilege = await Privilege.findOne({
				where: { name: privilegeName },
			});
			if (associatedPrivilege) {
				await role.addPrivilege(associatedPrivilege);
			}
		}
	} catch (error) {
		throw error;
	}
};
