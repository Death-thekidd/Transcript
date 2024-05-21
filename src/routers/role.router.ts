// src/routes/roleRoutes.ts
import { Router } from "express";
import { body, param } from "express-validator";
import * as roleController from "../controllers/role.controller";

const router = Router();

router.get("/roles", roleController.getRoles);

router.get(
	"/role/:id",
	param("id").isInt().withMessage("Role ID must be an integer"),
	roleController.getRole
);

router.post(
	"/create-role",
	body("name").isString().withMessage("Name must be a string"),
	body("privileges").isArray().withMessage("Privileges must be an array"),
	roleController.createRole
);

router.patch(
	"/edit-role/:id",
	param("id").isInt().withMessage("Role ID must be an integer"),
	body("name").isString().withMessage("Name must be a string"),
	body("privileges").isArray().withMessage("Privileges must be an array"),
	roleController.editRole
);

router.delete(
	"/delete-role/:id",
	param("id").isInt().withMessage("Role ID must be an integer"),
	roleController.deleteRole
);

router.patch(
	"/add-role",
	body("userId").isInt().withMessage("User ID must be an integer"),
	body("roleId").isInt().withMessage("Role ID must be an integer"),
	roleController.addRoleToUser
);

export default router;
