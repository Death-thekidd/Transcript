// routes/departmentRoutes.ts
import express from "express";
import {
	getDepartments,
	getDepartment,
	createDepartment,
	editDepartment,
	deleteDepartment,
} from "../controllers/department.controller";
import { body } from "express-validator";

const router = express.Router();

router.get("/departments", getDepartments);
router.get("/department/:id", getDepartment);
router.post(
	"/create-department",
	[
		body("name").notEmpty().withMessage("Name is required"),
		body("college").notEmpty().withMessage("College is required"),
	],
	createDepartment
);
router.patch("/edit-department/:id", editDepartment);
router.delete("/delete-department/:id", deleteDepartment);

export default router;
