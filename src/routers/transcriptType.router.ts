// src/routes/transcriptTypeRoutes.ts
import { Router } from "express";
import { param, body } from "express-validator";
import * as transcriptTypeController from "../controllers/transcript-type.controller";

const router = Router();

router.get("/transcript-types", transcriptTypeController.getTranscriptTypes);

router.get(
	"/transcript-type/:id",
	param("id").isString().withMessage("Transcript type ID must be a string"),
	transcriptTypeController.getTranscriptType
);

router.post(
	"/create-transcript-type",
	body("name").isString().withMessage("Name must be a string"),
	body("amount").isNumeric().withMessage("Amount must be a number"),
	transcriptTypeController.createTranscriptType
);

router.patch(
	"/edit-transcript-type/:id",
	param("id").isString().withMessage("Transcript type ID must be a string"),
	transcriptTypeController.editTranscriptType
);

router.delete(
	"/delete-transcript-type/:id",
	param("id").isString().withMessage("Transcript type ID must be a string"),
	transcriptTypeController.deleteTranscriptType
);

export default router;
