// src/controllers/userController.ts
import { Request, Response, NextFunction } from "express";
import { body, check, validationResult } from "express-validator";
import * as userService from "../services/user.service";
import User from "../database/models/user";
import { PrivilegeAttributes } from "../database/models/privilege";

/**
 * Get all users
 * @route GET /users
 */
export const getUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const users: User[] = await userService.getAllUsers();

		const usersWithRolesAndPrivileges = await Promise.all(
			users.map(async (user) => {
				const roles = await user.getRoles();
				const privileges: PrivilegeAttributes[] = [];

				for (const role of roles) {
					const rolePrivileges = await role.getPrivileges();
					for (const privilege of rolePrivileges) {
						if (!privileges.some((p) => p.name === privilege.name)) {
							privileges.push(privilege);
						}
					}
				}

				return {
					...user.dataValues,
					privileges,
					roles: roles.map((role) => role?.name),
				};
			})
		);

		return res.status(200).json({ data: usersWithRolesAndPrivileges });
	} catch (error) {
		next(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * Get User by ID
 * @route GET /user/:id
 */
export const getUser = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const userId: string = req.params.id;
		const user: User | null = await userService.getUserById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const roles = await user.getRoles();
		const privileges: PrivilegeAttributes[] = [];

		for (const role of roles) {
			const rolePrivileges = await role.getPrivileges();
			for (const privilege of rolePrivileges) {
				if (!privileges.some((p) => p.name === privilege.name)) {
					privileges.push(privilege);
				}
			}
		}

		return res.status(200).json({
			data: {
				...user.dataValues,
				privileges,
				roles: roles.map((role) => role?.name),
			},
		});
	} catch (error) {
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * Update profile information.
 * @route PATCH /update-user/:id
 */
export const updateUser = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	await check("email", "Please enter a valid email address.").isEmail().run(req);
	await body("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		await userService.updateUser(req.params.id, req.body);
		return res
			.status(200)
			.json({ message: "Profile information has been updated." });
	} catch (error) {
		if (error.name === "SequelizeUniqueConstraintError") {
			return res.status(409).json({
				error: "The email address is already associated with an account.",
			});
		}
		next(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * Delete user account.
 * @route DELETE /delete-user/:id
 */
export const deleteUser = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	try {
		const userId: string = req.params.id;
		await userService.deleteUserById(userId);
		req.logout();
		return res.status(200).json({ message: "Your account has been deleted" });
	} catch (error) {
		next(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
