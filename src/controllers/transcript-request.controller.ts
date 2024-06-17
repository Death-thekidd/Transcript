// src/controllers/transcriptRequestController.ts
import { Request, Response, NextFunction } from "express";
import * as transcriptRequestService from "../services/transcriptRequest.service";
import { validationResult } from "express-validator";
import { Identifier } from "sequelize";

export const getTranscriptRequests = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const transcriptRequests =
			await transcriptRequestService.getAllTranscriptRequests();
		return res.status(200).json({ data: transcriptRequests });
	} catch (error) {
		next(error);
	}
};

export const getRecentTranscriptRequests = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const transcriptRequests =
			await transcriptRequestService.getRecentTranscriptRequests(
				5,
				req.params.id as Identifier
			);
		return res.status(200).json({ data: transcriptRequests });
	} catch (error) {
		next(error);
	}
};

export const getTranscriptRequest = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const transcriptRequestId = req.params.id;
		const transcriptRequest =
			await transcriptRequestService.getTranscriptRequestById(transcriptRequestId);

		if (!transcriptRequest) {
			return res.status(404).json({ message: "Transcript Request not found" });
		}

		return res.status(200).json({ data: transcriptRequest });
	} catch (error) {
		next(error);
	}
};

export const submitTranscriptRequest = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const request = await transcriptRequestService.createTranscriptRequest(
			req.body
		);
		return res.status(201).json({
			message: "Transcript Request created successfully.",
			data: request,
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const updateTranscriptRequestStatus = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const { id } = req.params;
		const { status } = req.body;
		await transcriptRequestService.updateTranscriptRequestStatus(id, status);

		return res
			.status(204)
			.json({ message: "Transcript Request status updated successfully" });
	} catch (error) {
		next(error);
	}
};

export const deleteTranscriptRequest = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const { id } = req.params;
		const success = await transcriptRequestService.deleteTranscriptRequest(id);

		if (success) {
			return res
				.status(204)
				.json({ message: "Transcript request deleted successfully." });
		} else {
			return res.status(404).json({ message: "Transcript request not found." });
		}
	} catch (error) {
		next(error);
	}
};
