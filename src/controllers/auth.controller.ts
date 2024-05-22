// src/controllers/authController.ts
import { Request, Response, NextFunction } from "express";
import { body, check, validationResult } from "express-validator";
import passport from "passport";
import * as authService from "../services/auth.service";
import { IVerifyOptions } from "passport-local";
import { Identifier } from "sequelize";

/**
 * Sign in using email and password.
 * @route POST /login
 */
export const postLogin = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	await check("email", "Email is not valid").isEmail().run(req);
	await check("password", "Password cannot be blank")
		.isLength({ min: 1 })
		.run(req);
	await body("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array()[0].msg });
	}

	passport.authenticate(
		"local",
		(err: Error, user: Express.User, info: IVerifyOptions) => {
			if (err) {
				return res.status(500).json({ error: err.message });
			}
			if (!user) {
				return res.status(401).json({ error: info.message });
			}
			req.logIn(user, (err) => {
				if (err) {
					return res.status(500).json({ error: err.message });
				}
				return res
					.status(200)
					.json({ message: "Success! You are logged in.", user });
			});
		}
	)(req, res, next);
};

/**
 * Log out.
 * @route POST /logout
 */
export const logout = async (
	req: Request,
	res: Response
): Promise<Response> => {
	req.logout();
	return res.status(200).json({ message: "Success! You are logged out." });
};

/**
 * Create a new local account.
 * @route POST /signup
 */
export const postSignup = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		await check("email", "Email is not valid").isEmail().run(req);
		await check("password", "Password must be at least 4 characters long")
			.isLength({ min: 4 })
			.run(req);
		await body("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ error: errors.array()[0].msg });
		}

		await authService.createUser(req.body);
		return res.status(201).json({ message: "User registered successfully." });
	} catch (error) {
		console.error("Unable to create User record:", error);
		return res.status(500).json({ error: error.message });
	}
};

/**
 * Process the reset password request.
 * @route POST /reset/:token
 */
export const postReset = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	await check("password", "Password must be at least 4 characters long.")
		.isLength({ min: 4 })
		.run(req);
	await check("confirm", "Passwords must match.")
		.equals(req.body.password)
		.run(req);

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const user = await authService.resetPassword(
			req.params.token,
			req.body.password
		);
		await authService.sendResetPasswordEmail(user);

		return res
			.status(200)
			.json({ message: "Password reset email sent successfully." });
	} catch (error) {
		next(error);
	}
};

/**
 * Create a random token, then send the user an email with a reset link.
 * @route POST /forgot
 */
export const postForgot = async (
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
		const token = await authService.createRandomToken();
		const user = await authService.setResetToken(req.body.email, token);
		await authService.sendForgotPasswordEmail(user, token, req.headers.host);

		return res
			.status(200)
			.json({ message: "An e-mail has been sent with further instructions." });
	} catch (error) {
		next(error);
	}
};

/**
 * Gets user authentication status
 * @route GET /status
 */
export const getStatus = async (
	req: Request,
	res: Response
): Promise<Response> => {
	if (req.isAuthenticated()) {
		return res.json({
			valid: true,
			userId: (req.user as unknown as { id: Identifier }).id,
		});
	} else {
		return res.json({ valid: false });
	}
};
