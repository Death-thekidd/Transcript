// routes/destinationRoutes.ts
import express from "express";
import {
	getDestinations,
	getDestination,
	createDestination,
	editDestination,
	deleteDestination,
} from "../controllers/destination.controller";
import { body } from "express-validator";

const router = express.Router();

router.get("/destinations", getDestinations);
router.get("/destination/:id", getDestination);
router.post(
	"/create-destination",
	[
		body("name").notEmpty().withMessage("Name is required"),
		body("rate").isNumeric().withMessage("Rate must be a number"),
		body("deliveryMethod").notEmpty().withMessage("Delivery method is required"),
	],
	createDestination
);
router.patch("/edit-destination/:id", editDestination);
router.delete("/delete-destination/:id", deleteDestination);

export default router;
