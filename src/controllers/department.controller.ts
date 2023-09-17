import {
	TranscriptRequest,
	TranscriptRequestInstance,
} from "../models/transcript-request.model";
import { Role, RoleInstance } from "../models/role.model";
import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import async from "async";
import { Department, DepartmentInstance } from "../models/department.model";
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
		const departmentsNew = departments.map(
			async (department: DepartmentInstance) => {
				const college = await College.findByPk(department.id);
				return { ...department, collegeName: college.name };
			}
		);
		const departmentsConsumed = await Promise.all(departmentsNew);
		return res.status(200).json({ data: departmentsConsumed });
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

		const college = await College.findByPk(department.id);
		return res
			.status(200)
			.json({ data: { ...department, collegeName: college.name } });
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
			.status(201)
			.json({ message: "Deapartment created succesfully", data: department });
	} catch (error) {
		return res.status(500).json({ error: error });
	}
};

/**
 * Edit existing department
 * @route PATCH /edit-department/:id
 */
export const editDepartment = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	const id: string = req.params.id;
	const { name } = req.body;
	try {
		const department = await Department.findOne({ where: { id: id } });

		if (department) {
			// Update the record with new values
			department.name = name;
			// You can update multiple fields here

			// Save the changes to the database
			await department.save();
			return res
				.status(204)
				.json({ message: "Department updated successfully" });
		} else {
			return res.status(404).json({ message: "Department not found" });
		}
	} catch (error) {
		return res.status(500).json({ message: "Error editing department", error });
	}
};

/**
 * Delete department
 * @route DELETE /delete-department/:id
 */
export const deleteDepartment = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	try {
		const department = await Department.findOne({
			where: { id: req.params.id },
		});

		if (department) {
			// Delete the record
			await department.destroy();
			return res
				.status(204)
				.json({ message: "Department deleted successfully." });
		} else {
			return res.status(404).json({ message: "Department not found." });
		}
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error deleting department", error });
	}
};
