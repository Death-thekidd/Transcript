import {
	TranscriptRequest,
	TranscriptRequestInstance,
} from "../models/transcript-request.model";
import { User, UserInstance } from "../models/user.model";
import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import async from "async";
import { Wallet, WalletInstance } from "../models/wallet.model";
import { createWalletTransaction } from "./wallet.controller";
import { CurrencyType } from "../models/walletTransaction.model";
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
					const user = await User.findByPk(req.body.id);
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
						const {
							faculty,
							department,
							transcriptType,
							userId,
							deliveryMethod,
							destination,
						} = req.body;
						const _destination = await Destination.findOne({
							where: {
								deliveryMethod: deliveryMethod,
								name: destination,
							},
						});
						const _transcriptType = await TranscriptType.findOne({
							where: {
								name: transcriptType,
							},
						});
						const request = await TranscriptRequest.create({
							faculty: faculty,
							department: department,
							transcriptType: transcriptType,
							userId: userId,
							deliveryMethod: deliveryMethod,
							destination: destination,
							destinationId: _destination.id,
							rate: _destination.rate,
							transcriptFee: _transcriptType.amount,
							total: _destination.rate + _transcriptType.amount,
						});
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
