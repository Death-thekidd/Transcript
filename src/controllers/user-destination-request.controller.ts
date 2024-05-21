// src/controllers/destinationRequestController.ts
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import async from "async";
import * as destinationRequestService from "../services/userDestinationRequest.service";
import UserDestinationRequest from "../database/models/userdestinationrequest";
import { UserAttributes } from "../database/models/user";

/**
 * Get all destinations
 * @route GET /destination-requests
 */
export const getDestinationRequests = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const destinationRequests: UserDestinationRequest[] =
			await destinationRequestService.getAllDestinationRequests();
		return res.status(200).json({ data: destinationRequests });
	} catch (error) {
		next(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * Get destination by id
 * @route GET /destination-request/:id
 */
export const getDestinationRequest = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const destinationRequestId: string = req.params.id;
		const destinationRequest: UserDestinationRequest | null =
			await destinationRequestService.getDestinationRequestById(
				destinationRequestId
			);

		if (!destinationRequest) {
			return res.status(404).json({ message: "Destination Request not found" });
		}

		return res.status(200).json({ data: destinationRequest });
	} catch (error) {
		next(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * Create Destination request
 * @route POST /submit-destination-request
 */
export const submitDestinationRequest = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		async.waterfall(
			[
				async function checkUser(
					done: (err: Error | null, user: UserAttributes | null) => void
				) {
					const user = await destinationRequestService.findUserById(req.body.userId);
					if (!user) {
						return done(new Error("User not found."), null);
					}
					done(null, user);
				},
				async function saveRequest(
					user: UserAttributes,
					done: (
						err: Error | null,
						request: UserDestinationRequest | null,
						user: UserAttributes | null
					) => void
				) {
					try {
						const { name, userId } = req.body;
						const request = await destinationRequestService.createDestinationRequest(
							name,
							userId
						);
						done(null, request, user);
					} catch (error) {
						console.error("Unable to create Destination request: ", error);
						return done(error, null, null);
					}
				},
			],
			(err: Error | null, request: UserDestinationRequest | null) => {
				if (err) {
					return next(err);
				}

				return res.status(201).json({
					message: "Destination Request created successfully.",
					data: request,
				});
			}
		);
	} catch (error) {
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * Accept Destination request
 * @route PATCH accept-destination-request/:id
 */
export const acceptDestinationRequest = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const id: string = req.params.id;
		const result: [number, UserDestinationRequest[]] =
			await destinationRequestService.acceptDestinationRequestById(id);

		if (result[0] === 0) {
			return res.status(404).json({ message: "Destination Request not found" });
		}
		return res.status(200).json({ message: "Destination accepted" });
	} catch (error) {
		next(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
