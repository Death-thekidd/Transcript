// controllers/departmentController.ts
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as departmentService from "../services/department.service";

export const getDepartments = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const departments = await departmentService.getAllDepartments();
		return res.status(200).json({ data: departments });
	} catch (error) {
		next(error);
	}
};

export const getDepartment = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const department = await departmentService.getDepartmentById(req.params.id);
		if (!department) {
			return res.status(404).json({ message: "Department not found" });
		}
		return res.status(200).json({ data: department });
	} catch (error) {
		next(error);
	}
};

export const createDepartment = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, college } = req.body;
		const department = await departmentService.createDepartment(name, college);
		return res
			.status(201)
			.json({ message: "Department created successfully", data: department });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const editDepartment = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const department = await departmentService.updateDepartment(
			req.params.id,
			req.body.name
		);
		if (!department) {
			return res.status(404).json({ message: "Department not found" });
		}
		return res.status(204).json({ message: "Department updated successfully" });
	} catch (error) {
		return res.status(500).json({ message: "Error editing department", error });
	}
};

export const deleteDepartment = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		await departmentService.deleteDepartment(req.params.id);
		return res.status(204).json({ message: "Department deleted successfully" });
	} catch (error) {
		if (error.message === "Department not found") {
			return res.status(404).json({ message: "Department not found" });
		}
		return res.status(500).json({ message: "Error deleting department", error });
	}
};
