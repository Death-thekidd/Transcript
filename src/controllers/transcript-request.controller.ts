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
		const transcriptRequests = await TranscriptRequest.findAll({
			include: [Destination, TranscriptType],
		});
		const transcriptRequestsData = await Promise.all(
			transcriptRequests.map(async (transcriptRequest) => {
				const destinations = await transcriptRequest.getDestinations();
				const transcriptType = await transcriptRequest.getTranscriptType();

				const user = await User.findByPk(transcriptRequest?.userId);

				const destinationtotal = destinations?.reduce(
					(acc, destination) => (acc += destination?.rate),
					0
				);
				const amount = destinationtotal + transcriptType?.amount;

				return {
					...transcriptRequest.dataValues,
					destinations,
					transcriptTypeDefined: transcriptType,
					totalFee: amount,
					name: user?.name
				};
			})
		);

		return res.status(200).json({ data: transcriptRequestsData });
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

		const destinations = await transcriptRequest?.getDestinations();
		const transcriptType = await transcriptRequest?.getTranscriptType();

		const destinationtotal = destinations?.reduce(
			(acc, destination) => (acc += destination?.rate),
			0
		);
		const amount = destinationtotal + transcriptType?.amount;

		return res.status(200).json({
			data: {
				...transcriptRequest.dataValues,
				destinations,
				transcriptTypeDefined: transcriptType,
				totalFee: amount,
			},
		});
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
					console.log(req.body.userId);
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
							total: _transcriptType.amount,
						});
						const transcriptRequest = await TranscriptRequest.findByPk(
							request.id,
							{
								include: Destination,
							}
						);
						for (const name of destinations) {
							const destination = await Destination.findOne({
								where: { id: name },
							});
							await transcriptRequest.addDestination(destination);
						}
						transcriptRequest.setTranscriptType(_transcriptType);
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

/**
 * Update Transcript request status
 * @route PATCH /update-transcript-request-status/:id
 */
export const updateTranscriptRequestStaus = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	try {
		const id = req.params.id;
		const {status} = req.body;
		await TranscriptRequest.update(
			{status: status},
			{ where: { id: id } }
		);

		return res.status(204).json({ message: "Transcript Request status updated successfullu" });
	} catch (error) {
		next(error);
	}
};

/**
 * Delete Transcript request
 * @route DELETE /delete-transcript-request/:id
 */
export const deleteTranscriptRequest = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	try {
		const transcriptRequestId = req.params.id;
		const transcriptRequest= await TranscriptRequest.findOne({
			where: { id: transcriptRequestId },
		});

		if (transcriptRequest) {
			// Delete the record
			await transcriptRequest.destroy();
			return res.status(204).json({ message: "transcript request deleted successfully." });
		} else {
			return res.status(404).json({ message: "transcript request not found." });
		}
	} catch (error) {
		next(error);
	}
};


/**
 * Generate Transcript request PDF
 * @route GET /generate-transcript-request-pdf/:id
 */
export const generateTranscriptRequestPdf = async (
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
