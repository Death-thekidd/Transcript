import { Role, RoleInstance } from "../models/role.model";
import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { Privilege } from "../models/privilege.model";
import { Op } from "sequelize";

/**
 * Get all roles
 * @route GET /roles
 */
export const getRoles = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	try {
		const roles = await Role.findAll();
		return res.status(200).json({ data: roles });
	} catch (error) {
		next(error);
	}
};

/**
 * Get role by ID
 * @route GET /role/:id
 */
export const getRole = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	try {
		const roleId = req.params.id;
		const role = await Role.findByPk(roleId);

		if (!role) {
			return res.status(404).json({ message: "Role not found" });
		}

		return res.status(200).json({ data: role });
	} catch (error) {
		next(error);
	}
};

async function assignPrivilegesToRole(
	role: RoleInstance,
	privileges: string[]
) {
	try {
		// Ensure that the role and privileges are valid
		if (!role || !Array.isArray(privileges) || privileges.length === 0) {
			return;
		}

		// Remove all existing privileges associated with the role
		await role.removePrivileges();

		// Assign the specified privileges to the role
		for (const privilege of privileges) {
			const associatedPrivilege = await Privilege.findOne({
				where: { name: privilege },
			});
			if (associatedPrivilege) {
				await role.addPrivilege(associatedPrivilege);
			}
		}
	} catch (error) {
		console.error("Error assigning privileges to role:", error);
	}
}

/**
 * Create new Role
 * @route POST /create-role
 */
export const createRole = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// Return validation errors as JSON
			return res.status(400).json({ errors: errors.array() });
		}

		const role = await Role.create({
			name: req.body.name,
		});
		// Check if privileges were provided in the request body
		if (Array.isArray(req.body.privileges) && req.body.privileges.length > 0) {
			// Assign the specified privileges to the newly created role
			await assignPrivilegesToRole(role, req.body.privileges);
		}
		return res
			.status(200)
			.json({ message: "Role created succesfully", data: role });
	} catch (error) {
		return res.status(500).json({ error: error });
	}
};

/**
 * Edit Role
 * @route PATCH /edit-role
 */
export const editRole = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	const roleId = req.params.id;
	const { name, privileges } = req.body; // You can pass the new name and updated privileges here

	try {
		const role = await Role.findByPk(roleId);

		if (!role) {
			return res.status(404).json({ message: "Role not found" });
		}

		// Update the role attributes
		role.name = name;
		await role.save();

		// Update privileges (if needed)
		if (privileges) {
			assignPrivilegesToRole(role, privileges);
		}

		return res.status(200).json({ message: "Role updated successfully" });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

/**
 * Delete Role
 * @route DELET6E /delete-role
 */
export const deleteRole = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	const roleId = req.params.id;

	try {
		const role = await Role.findByPk(roleId);

		if (!role) {
			return res.status(404).json({ message: "Role not found" });
		}

		// Remove the role and its associations
		await role.destroy();

		return res.status(200).json({ message: "Role deleted successfully" });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

/**
 * Add Role to User
 * @route PATCH /add-role
 */
export const addRole = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// Return validation errors as JSON
			return res.status(400).json({ errors: errors.array() });
		}

		const { userId } = req.params;
		const { roleId } = req.body;

		const user = await User.findByPk(userId);
		const role = await Role.findByPk(roleId);

		if (!user) {
			throw new Error("User not found");
		}

		if (!role) {
			throw new Error("Role not found");
		}

		await user.addRole(role);
		return res.status(204).json({ message: "Role added succesfully" });
	} catch (error) {
		return res.status(500).json({ error: error });
	}
};
