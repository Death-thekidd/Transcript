import { User, UserInstance } from "../models/user.model";
import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import async from "async";
import { UserDestinationRequestInstance } from "../models/user-destination-request.model";
import { UserDestinationRequest } from "../models/user-destination-request.model";
import { where } from "sequelize";

/**
 * Create Destination request
 * @route POST /submit-destination-request
 */
export const submitDestinationRequest = async (
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
						request: UserDestinationRequestInstance,
						user: UserInstance
					) => void
				) {
					try {
						const { name, userId } = req.body;
						const request = await UserDestinationRequest.create({
							name,
							userId,
							status: "pending",
						});
						done(null, request, user);
					} catch (error) {
						console.error("Unable to create Destination request : ", error);
						return done(error, null, null); // Pass an error to the next function
					}
				},
			],
			(err, request: UserDestinationRequestInstance) => {
				if (err) {
					return next(err); // Handle errors at the end of the waterfall
				}

				return res.status(201).json({
					message: "Destination Request created successfully.",
					data: request,
				});
			}
		);
	} catch (error) {
		return res.status(500).json({ error: error });
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
): Promise<Response<any, Record<string, any>>> => {
	try {
		const id = req.params.id;
		await UserDestinationRequest.update(
			{ status: "accepted" },
			{ where: { id: id } }
		);
		return res.status(204).json({ message: "Destination accepted" });
	} catch (error) {
		return res.status(500).json({ error: error });
	}
};
