// src/routes/destinationRequestRoutes.ts
import { Router } from "express";
import { param, body } from "express-validator";
import * as destinationRequestController from "../controllers/user-destination-request.controller";

const router = Router();

router.get(
	"/destination-requests",
	destinationRequestController.getDestinationRequests
);

router.get(
	"/destination-request/:id",
	param("id").isString().withMessage("Destination request ID must be a string"),
	destinationRequestController.getDestinationRequest
);

router.post(
	"/submit-destination-request",
	body("name").isString().withMessage("Name must be a string"),
	body("userId").isString().withMessage("User ID must be a string"),
	destinationRequestController.submitDestinationRequest
);

router.patch(
	"/accept-destination-request/:id",
	param("id").isString().withMessage("Destination request ID must be a string"),
	destinationRequestController.acceptDestinationRequest
);

export default router;
