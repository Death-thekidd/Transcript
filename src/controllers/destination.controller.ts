import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { College } from "../models/college.model";
import { Destination } from "../models/destination.model";

/**
 * Get all destinations
 * @route GET /destinations
 */
export const getDestinations = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	try {
		const destinations = await Destination.findAll();
		return res.status(200).json({ data: destinations });
	} catch (error) {
		next(error);
	}
};

/**
 * Get destination by ID
 * @route GET /destination/:id
 */
export const getDestination = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	try {
		const destinationId = req.params.id;
		const destination = await Destination.findByPk(destinationId);

		if (!destination) {
			return res.status(404).json({ message: "Destination not found" });
		}

		return res.status(200).json({ data: destination });
	} catch (error) {
		next(error);
	}
};

/**
 * Create new Destination
 * @route POST /create-destination
 */
export const createDestination = async (
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

		const destination = await Destination.create({
			name: req.body.name,
			rate: req.body.rate,
			deliveryMethod: req.body.deliveryMethod,
		});
		return res
			.status(200)
			.json({ message: "College created succesfully", data: destination });
	} catch (error) {
		return res.status(500).json({ error: error });
	}
};

/**
 * Edit existing destination
 * @route PATCH /edit-destination/:id
 */
export const editDestination = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	const id: string = req.params.id;
	try {
		const result = await Destination.update(
			{ ...req.body },
			{ where: { id: id } }
		);

		if (result[0] === 0) {
			return res.status(404).json({ message: "college not found" });
		}
		return res
			.status(204)
			.json({ message: "destination updated successfully" });
	} catch (error) {
		return res.status(500).json({ message: "Error editing college", error });
	}
};

/**
 * Delete destination
 * @route DELETE /delete-destination/:id
 */
export const deleteDestination = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	try {
		const college = await College.findOne({
			where: { id: req.params.id },
		});

		if (college) {
			// Delete the record
			await college.destroy();
			return res.status(204).json({ message: "college deleted successfully." });
		} else {
			return res.status(404).json({ message: "college not found." });
		}
	} catch (error) {
		return res.status(500).json({ message: "Error deleting college", error });
	}
};
