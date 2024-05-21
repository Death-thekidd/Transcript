// routes/collegeRoutes.ts
import express from "express";
import {
	getColleges,
	getCollege,
	createCollege,
	editCollege,
	deleteCollege,
} from "../controllers/college.controller";
import { body } from "express-validator";

const router = express.Router();

router.get("/colleges", getColleges);
router.get("/college/:id", getCollege);
router.post(
	"/create-college",
	[body("name").notEmpty().withMessage("Name is required")],
	createCollege
);
router.patch("/edit-college/:id", editCollege);
router.delete("/delete-college/:id", deleteCollege);

export default router;
