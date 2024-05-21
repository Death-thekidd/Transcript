// controllers/privilegeController.ts
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as privilegeService from "../services/privilege.service";
import Privilege from "../database/models/privilege";

export const getPrivileges = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const privileges: Privilege[] = await privilegeService.getAllPrivileges();
		return res.status(200).json({ data: privileges });
	} catch (error) {
		next(error);
	}
};

export const getPrivilege = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const privilegeId = req.params.id;
		const privilege: Privilege = await privilegeService.getPrivilegeById(
			privilegeId
		);
		return res.status(200).json({ data: privilege });
	} catch (error) {
		if (error.message === "Privilege not found") {
			return res.status(404).json({ message: error.message });
		}
		next(error);
	}
};

export const createPrivilege = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const privilege: Privilege = await privilegeService.createPrivilege(
			req.body.name
		);
		return res
			.status(200)
			.json({ message: "Privilege created successfully", data: privilege });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const addPrivilegeToRole = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { roleName, assignedPrivileges } = req.body;
		await privilegeService.addPrivilegeToRole(roleName, assignedPrivileges);
		return res.status(204).json({ message: "Privileges added successfully" });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
