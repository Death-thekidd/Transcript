import {
	TranscriptRequest,
	TranscriptRequestInstance,
} from "../models/transcript-request.model";
import { User, UserInstance } from "../models/user.model";
import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import async from "async";
import { Destination } from "../models/destination.model";
import { TranscriptType } from "../models/transcript-type.model";

/**
 * Get all transcript requests
 * @route GET /transcript-requests
 */
export const getTranscriptRequests = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	try {
		const transcriptRequests = await TranscriptRequest.findAll();
		return res.status(200).json({ data: transcriptRequests });
	} catch (error) {
		next(error);
	}
};

/**
 * Get transcript request by ID
 * @route GET /transcript-request/:id
 */
export const getTranscriptRequest = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	try {
		const transcriptRequestId = req.params.id;
		const transcriptRequest = await TranscriptRequest.findByPk(
			transcriptRequestId
		);

		if (!transcriptRequest) {
			return res.status(404).json({ message: "Transcript Request not found" });
		}

		return res.status(200).json({ data: transcriptRequest });
	} catch (error) {
		next(error);
	}
};

/**
 * Create Transcript request
 * @route POST /submit-request
 */
export const submitTranscriptRequest = async (
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

		async.waterfall(
			[
				async function checkUser(
					done: (err: Error, user: UserInstance) => void
				) {
					const user = await User.findByPk(req.body.userId);
					if (!user) {
						return done(new Error("User not found."), null); // Pass an error to the next function
					}
					done(undefined, user);
				},
				async function saveRequest(
					user: UserInstance,
					done: (
						err: Error,
						request: TranscriptRequestInstance,
						user: UserInstance
					) => void
				) {
					try {
						const { transcriptType, userId, destinations } = req.body;
						const _transcriptType = await TranscriptType.findOne({
							where: {
								name: transcriptType,
							},
						});
						const request = await TranscriptRequest.create({
							college: user.college,
							department: user.department,
							matricNo: user.schoolId,
							transcriptType: transcriptType,
							status: "pending",
							userId: userId,
						});
						const transcriptRequest = await TranscriptRequest.findByPk(
							request.id,
							{
								include: Destination,
							}
						);
						for (const { name, deliveryMethod } of destinations) {
							const destination = await Destination.findOne({
								where: { name: name, deliveryMethod: deliveryMethod },
							});
							await transcriptRequest.addDestination(destination);
						}
						transcriptRequest.addTranscriptType(_transcriptType);
						done(null, request, user);
					} catch (error) {
						console.error("Unable to create Leave request : ", error);
						return done(error, null, null); // Pass an error to the next function
					}
				},
			],
			(err, request: TranscriptRequestInstance) => {
				if (err) {
					return next(err); // Handle errors at the end of the waterfall
				}

				return res.status(201).json({
					message: "Trannscript Request created successfully.",
					data: request,
				});
			}
		);
	} catch (error) {
		return res.status(500).json({ error: error });
	}
};
