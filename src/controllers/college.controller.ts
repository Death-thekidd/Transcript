import {
	TranscriptRequest,
	TranscriptRequestInstance,
} from "../models/transcript-request.model";
import { Role, RoleInstance } from "../models/role.model";
import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { College } from "../models/college.model";

/**
 * Get all college
 * @route GET /colleges
 */
export const getColleges = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	try {
		const colleges = await College.findAll();
		return res.status(200).json({ data: colleges });
	} catch (error) {
		next(error);
	}
};

/**
 * Get college by ID
 * @route GET /college/:id
 */
export const getCollege = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	try {
		const collegeId = req.params.id;
		const college = await Role.findByPk(collegeId);

		if (!college) {
			return res.status(404).json({ message: "College not found" });
		}

		return res.status(200).json({ data: college });
	} catch (error) {
		next(error);
	}
};

/**
 * Create new College
 * @route POST /create-college
 */
export const createCollege = async (
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

		const college = await College.create({
			name: req.body.name,
		});
		return res
			.status(200)
			.json({ message: "College created succesfully", data: college });
	} catch (error) {
		return res.status(500).json({ error: error });
	}
};
