import {
	TranscriptRequest,
	TranscriptRequestInstance,
} from "../models/transcript-request.model";
import { Role, RoleInstance } from "../models/role.model";
import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import async from "async";
import { Department } from "../models/department.model";
import { College } from "../models/college.model";

/**
 * Get all departments
 * @route GET /departments
 */
export const getDepartments = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	try {
		const departments = await Department.findAll();
		return res.status(200).json({ data: departments });
	} catch (error) {
		next(error);
	}
};

/**
 * Get department by ID
 * @route GET /department/:id
 */
export const getDepartment = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	try {
		const departmentId = req.params.id;
		const department = await Department.findByPk(departmentId);

		if (!department) {
			return res.status(404).json({ message: "Department not found" });
		}

		return res.status(200).json({ data: department });
	} catch (error) {
		next(error);
	}
};

/**
 * Create new Department
 * @route POST /create-department
 */
export const createDepartment = async (
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

		const { name, college } = req.body;

		const _college = await College.findOne({
			where: {
				name: college,
			},
		});
		if (!_college) {
			return res
				.status(404)
				.json({ error: "Department does not have a college" });
		}

		const department = await Department.create({
			name: name,
			collegeId: _college.id,
		});
		return res
			.status(200)
			.json({ message: "Role created succesfully", data: department });
	} catch (error) {
		return res.status(500).json({ error: error });
	}
};
