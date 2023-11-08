import { Role } from "../models/role.model";
import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { Privilege } from "../models/privilege.model";

/**
 * Get all privileges
 * @route GET /privileges
 */
export const getPrivileges = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	try {
		const privileges = await Privilege.findAll();
		return res.status(200).json({ data: privileges });
	} catch (error) {
		next(error);
	}
};

/**
 * Get privilege by ID
 * @route GET /privilege/:id
 */
export const getPrivilege = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	try {
		const privilegeId = req.params.id;
		const privilege = await Role.findByPk(privilegeId);

		if (!privilege) {
			return res.status(404).json({ message: "Privilege not found" });
		}

		return res.status(200).json({ data: privilege });
	} catch (error) {
		next(error);
	}
};

/**
 * Create new Privilege
 * @route POST /create-privilege
 */
export const createPrivilege = async (
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

		const privilege = await Privilege.create({
			name: req.body.name,
		});
		return res
			.status(200)
			.json({ message: "Privilege created succesfully", data: privilege });
	} catch (error) {
		return res.status(500).json({ error: error });
	}
};

/**
 * Add privilege to Role
 * @route PATCH /add-privilege
 */
export const addPrivildege = async (
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

		const { roleName, assignedPrivileges } = req.body;

		// Find the role by name
		const role = await Role.findOne({ where: { name: roleName } });

		if (!role) {
			console.log(`Role '${roleName}' not found.`);
			return;
		}

		// Remove all existing privileges associated with the role
		await role.removePrivileges();

		// Assign the specified privileges to the role
		for (const privilege of assignedPrivileges) {
			const associatedPrivilege = await Privilege.findOne({
				where: { name: privilege },
			});
			if (associatedPrivilege) {
				await role.addPrivilege(associatedPrivilege);
			}
		}
		return res.status(204).json({ message: "Priviledges added succesfully" });
	} catch (error) {
		return res.status(500).json({ error: error });
	}
};
