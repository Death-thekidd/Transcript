// src/controllers/roleController.ts
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as roleService from "../services/role.service";

export const getRoles = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const roles = await roleService.getAllRoles();
		return res.status(200).json({ data: roles });
	} catch (error) {
		next(error);
	}
};

export const getRole = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const roleId = parseInt(req.params.id);
		const role = await roleService.getRoleById(roleId);

		if (!role) {
			return res.status(404).json({ message: "Role not found" });
		}

		return res.status(200).json({ data: role });
	} catch (error) {
		next(error);
	}
};

export const createRole = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, privileges } = req.body;
		const role = await roleService.createRole(name, privileges);

		return res
			.status(200)
			.json({ message: "Role created successfully", data: role });
	} catch (error) {
		next(error);
	}
};

export const editRole = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const roleId = parseInt(req.params.id);
		const { name, privileges } = req.body;

		const role = await roleService.updateRole(roleId, name, privileges);

		if (!role) {
			return res.status(404).json({ message: "Role not found" });
		}

		return res
			.status(200)
			.json({ message: "Role updated successfully", data: role });
	} catch (error) {
		next(error);
	}
};

export const deleteRole = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const roleId = parseInt(req.params.id);
		const deleted = await roleService.deleteRole(roleId);

		if (!deleted) {
			return res.status(404).json({ message: "Role not found" });
		}

		return res.status(200).json({ message: "Role deleted successfully" });
	} catch (error) {
		next(error);
	}
};

export const addRoleToUser = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { userId, roleId } = req.body;
		const added = await roleService.addRoleToUser(userId, roleId);

		if (!added) {
			return res.status(404).json({ message: "User or Role not found" });
		}

		return res.status(200).json({ message: "Role added successfully" });
	} catch (error) {
		next(error);
	}
};
