// src/controllers/transcriptTypeController.ts
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as transcriptTypeService from "../services/transcriptType.service";
import TranscriptType from "../database/models/transcripttype";

/**
 * Get all transcript types
 * @route GET /transcript-types
 */
export const getTranscriptTypes = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const transcriptTypes: TranscriptType[] =
			await transcriptTypeService.getAllTranscriptTypes();
		return res.status(200).json({ data: transcriptTypes });
	} catch (error) {
		next(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * Get transcript type by ID
 * @route GET /transcript-type/:id
 */
export const getTranscriptType = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const transcriptTypeId: string = req.params.id;
		const transcriptType: TranscriptType | null =
			await transcriptTypeService.getTranscriptTypeById(transcriptTypeId);

		if (!transcriptType) {
			return res.status(404).json({ message: "Transcript type not found" });
		}

		return res.status(200).json({ data: transcriptType });
	} catch (error) {
		next(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * Create new Transcript Type
 * @route POST /create-transcript-type
 */
export const createTranscriptType = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// Return validation errors as JSON
			return res.status(400).json({ errors: errors.array() });
		}

		const transcriptType: TranscriptType =
			await transcriptTypeService.createTranscriptType(
				req.body.name,
				req.body.amount
			);
		return res.status(201).json({
			message: "Transcript Type created successfully",
			data: transcriptType,
		});
	} catch (error) {
		next(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * Edit existing transcript type
 * @route PATCH /edit-transcript-type/:id
 */
export const editTranscriptType = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	const id: string = req.params.id;
	try {
		const result: [number, TranscriptType[]] =
			await transcriptTypeService.updateTranscriptType(id, req.body);

		if (result[0] === 0) {
			return res.status(404).json({ message: "Transcript type not found" });
		}
		return res
			.status(200)
			.json({ message: "Transcript type updated successfully" });
	} catch (error) {
		next(error);
		return res
			.status(500)
			.json({ message: "Error editing transcript type", error });
	}
};

/**
 * Delete transcript type
 * @route DELETE /delete-transcript-type/:id
 */
export const deleteTranscriptType = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const transcriptType: TranscriptType | null =
			await transcriptTypeService.deleteTranscriptType(req.params.id);

		if (transcriptType) {
			return res
				.status(200)
				.json({ message: "Transcript type deleted successfully." });
		} else {
			return res.status(404).json({ message: "Transcript type not found." });
		}
	} catch (error) {
		next(error);
		return res
			.status(500)
			.json({ message: "Error deleting transcript type", error });
	}
};
