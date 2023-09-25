import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { TranscriptType } from "../models/transcript-type.model";

/**
 * Get all transcript types
 * @route GET /transcript-types
 */
export const getTranscriptTypes = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	try {
		const transcriptTypes = await TranscriptType.findAll();
		return res.status(200).json({ data: transcriptTypes });
	} catch (error) {
		next(error);
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
): Promise<Response<any, Record<string, any>>> => {
	try {
		const transcriptTypeId = req.params.id;
		const transcriptType = await TranscriptType.findByPk(transcriptTypeId);

		if (!transcriptType) {
			return res.status(404).json({ message: "Transcipt type not found" });
		}

		return res.status(200).json({ data: transcriptType });
	} catch (error) {
		next(error);
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
): Promise<Response<any, Record<string, any>>> => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// Return validation errors as JSON
			return res.status(400).json({ errors: errors.array() });
		}

		const transcriptType = await TranscriptType.create({
			name: req.body.name,
			amount: req.body.amount,
		});
		return res.status(200).json({
			message: "Transcipt Type created succesfully",
			data: transcriptType,
		});
	} catch (error) {
		return res.status(500).json({ error: error });
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
): Promise<Response<any, Record<string, any>>> => {
	const id: string = req.params.id;
	try {
		const result = await TranscriptType.update(
			{ ...req.body },
			{ where: { id: id } }
		);

		if (result[0] === 0) {
			return res.status(404).json({ message: "transcript type not found" });
		}
		return res
			.status(204)
			.json({ message: "transcript type updated successfully" });
	} catch (error) {
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
): Promise<Response<any, Record<string, any>>> => {
	try {
		const transcriptType = await TranscriptType.findOne({
			where: { id: req.params.id },
		});

		if (transcriptType) {
			// Delete the record
			await transcriptType.destroy();
			return res
				.status(204)
				.json({ message: "transcript type deleted successfully." });
		} else {
			return res.status(404).json({ message: "transcript type not found." });
		}
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error deleting transcript type", error });
	}
};
