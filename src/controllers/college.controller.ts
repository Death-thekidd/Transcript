// controllers/collegeController.ts
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as collegeService from "../services/college.service";

export const getColleges = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const colleges = await collegeService.getAllColleges();
		return res.status(200).json({ data: colleges });
	} catch (error) {
		next(error);
	}
};

export const getCollege = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const college = await collegeService.getCollegeById(req.params.id);

		if (!college) {
			return res.status(404).json({ message: "College not found" });
		}

		return res.status(200).json({ data: college });
	} catch (error) {
		next(error);
	}
};

export const createCollege = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const college = await collegeService.createCollege(req.body.name);
		return res
			.status(200)
			.json({ message: "College created successfully", data: college });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const editCollege = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		await collegeService.updateCollege(req.params.id, req.body.name);
		return res.status(204).json({ message: "College updated successfully" });
	} catch (error) {
		if (error.message === "College not found") {
			return res.status(404).json({ message: "College not found" });
		}
		return res.status(500).json({ message: "Error editing college", error });
	}
};

export const deleteCollege = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		await collegeService.deleteCollege(req.params.id);
		return res.status(204).json({ message: "College deleted successfully" });
	} catch (error) {
		if (error.message === "College not found") {
			return res.status(404).json({ message: "College not found" });
		}
		return res.status(500).json({ message: "Error deleting college", error });
	}
};
