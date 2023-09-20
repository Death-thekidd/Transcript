import {
	TranscriptRequest,
	TranscriptRequestInstance,
} from "../models/transcript-request.model";
import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { College } from "../models/college.model";
import { Department, DepartmentInstance } from "../models/department.model";

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
		const colleges = await College.findAll({
			include: Department,
		});
		const collegeData = colleges.map((college) => {
			const departments = college.Departments
				? college.Departments.map((department) => department.name)
				: [];
			return {
				id: college.id,
				name: college.name,
				departments,
			};
		});

		return res.status(200).json({ data: collegeData });
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
		const college = await College.findByPk(collegeId);

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

/**
 * Edit existing college
 * @route PATCH /edit-college/:id
 */
export const editCollege = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	const id: string = req.params.id;
	const { name } = req.body;
	try {
		const college = await College.findOne({ where: { id: id } });

		if (college) {
			// Update the record with new values
			college.name = name;
			// You can update multiple fields here

			// Save the changes to the database
			await college.save();
			return res.status(204).json({ message: "college updated successfully" });
		} else {
			return res.status(404).json({ message: "college not found" });
		}
	} catch (error) {
		return res.status(500).json({ message: "Error editing college", error });
	}
};

/**
 * Delete college
 * @route DELETE /delete-college/:id
 */
export const deleteCollege = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	try {
		const college = await College.findOne({
			where: { id: req.params.id },
		});

		if (college) {
			// Delete the record
			await college.destroy();
			return res.status(204).json({ message: "college deleted successfully." });
		} else {
			return res.status(404).json({ message: "college not found." });
		}
	} catch (error) {
		return res.status(500).json({ message: "Error deleting college", error });
	}
};
