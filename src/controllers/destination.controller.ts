// controllers/destinationController.ts
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as destinationService from "../services/destination.service";

export const getDestinations = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const destinations = await destinationService.getAllDestinations();
		return res.status(200).json({ data: destinations });
	} catch (error) {
		next(error);
	}
};

export const getDestination = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const destination = await destinationService.getDestinationById(
			req.params.id
		);
		if (!destination) {
			return res.status(404).json({ message: "Destination not found" });
		}
		return res.status(200).json({ data: destination });
	} catch (error) {
		next(error);
	}
};

export const createDestination = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, rate, deliveryMethod } = req.body;
		const destination = await destinationService.createDestination(
			name,
			rate,
			deliveryMethod
		);
		return res
			.status(201)
			.json({ message: "Destination created successfully", data: destination });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const editDestination = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const updatedRowsCount = await destinationService.updateDestination(
			req.params.id,
			req.body
		);
		if (updatedRowsCount === 0) {
			return res.status(404).json({ message: "Destination not found" });
		}
		return res.status(204).json({ message: "Destination updated successfully" });
	} catch (error) {
		return res.status(500).json({ message: "Error editing destination", error });
	}
};

export const deleteDestination = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		await destinationService.deleteDestination(req.params.id);
		return res.status(204).json({ message: "Destination deleted successfully" });
	} catch (error) {
		if (error.message === "Destination not found") {
			return res.status(404).json({ message: "Destination not found" });
		}
		return res.status(500).json({ message: "Error deleting destination", error });
	}
};
