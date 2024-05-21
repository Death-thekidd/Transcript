// src/routes/transcriptRequestRoutes.ts
import { Router } from "express";
import { param, body } from "express-validator";
import * as transcriptRequestController from "../controllers/transcript-request.controller";

const router = Router();

router.get(
	"/transcript-requests",
	transcriptRequestController.getTranscriptRequests
);

router.get(
	"/transcript-request/:id",
	param("id").isString().withMessage("Transcript request ID must be a string"),
	transcriptRequestController.getTranscriptRequest
);

router.post(
	"/submit-request",
	body("userId").isString().withMessage("User ID must be a string"),
	body("transcriptType")
		.isString()
		.withMessage("Transcript type must be a string"),
	body("destinations").isArray().withMessage("Destinations must be an array"),
	transcriptRequestController.submitTranscriptRequest
);

router.patch(
	"/update-transcript-request-status/:id",
	param("id").isString().withMessage("Transcript request ID must be a string"),
	body("status").isString().withMessage("Status must be a string"),
	transcriptRequestController.updateTranscriptRequestStatus
);

router.delete(
	"/delete-transcript-request/:id",
	param("id").isString().withMessage("Transcript request ID must be a string"),
	transcriptRequestController.deleteTranscriptRequest
);

export default router;
