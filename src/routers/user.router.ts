// src/routes/userRoutes.ts
import { Router } from "express";
import { param, body } from "express-validator";
import * as userController from "../controllers/user.controller";

const router = Router();

router.get("/users", userController.getUsers);

router.get(
	"/user/:id",
	param("id").isString().withMessage("User ID must be a string"),
	userController.getUser
);

router.patch(
	"/update-user/:id",
	param("id").isString().withMessage("User ID must be a string"),
	body("email").isEmail().withMessage("Please enter a valid email address."),
	body("email").normalizeEmail({ gmail_remove_dots: false }),
	userController.updateUser
);

router.delete(
	"/delete-user/:id",
	param("id").isString().withMessage("User ID must be a string"),
	userController.deleteUser
);

export default router;
