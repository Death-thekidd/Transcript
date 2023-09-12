import {
	TranscriptRequest,
	TranscriptRequestInstance,
} from "../models/transcript-request.model";
import { Role, RoleInstance } from "../models/role.model";
import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import async from "async";
import { Wallet, WalletInstance } from "../models/wallet.model";
import { createWalletTransaction } from "./wallet.controller";
import { CurrencyType } from "../models/walletTransaction.model";
import { Destination } from "../models/destination.model";
import { TranscriptType } from "../models/transcript-type.model";

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
		return res
			.status(200)
			.json({ message: "Role created succesfully", data: role });
	} catch (error) {
		return res.status(500).json({ error: error });
	}
};
