import passport from "passport";
import passportLocal from "passport-local";

// import { User, UserType } from '../models/User';
import User from "../database/models/user";
import { Request, Response, NextFunction } from "express";

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((req, user: User, done) => {
	done(undefined, user.id);
});

passport.deserializeUser(async (id: string, done) => {
	try {
		const user = await User.findByPk(id);
		done(null, user);
	} catch (err) {
		done(err, null);
	}
});

/**
 * Sign in using Email and Password.
 */
passport.use(
	new LocalStrategy(
		{ usernameField: "email" },
		async (email, password, done) => {
			try {
				const user = await User.findOne({
					where: { email: email.toLowerCase() },
				});
				if (!user) {
					return done(undefined, false, {
						message: `Email ${email} not found.`,
					});
				}
				user.comparePassword(password, async (err: Error, isMatch: boolean) => {
					if (err) {
						return done(err);
					}
					if (isMatch) {
						return done(undefined, user);
					}
					return done(undefined, false, {
						message: "Invalid email or password.",
					});
				});
			} catch (err) {
				if (err) {
					return done(err);
				}
			}
		}
	)
);

/**
 * Login Required middleware.
 */
export const isAuthenticated = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.status(403).send({ message: "You've been signed out" });
};

/**
 * Authorization Required middleware.
 */
// export const isAuthorized = (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	const provider = req.path.split("/").slice(-1)[0];

// 	const user = req.user as UserDocument;
// 	if (find(user.tokens, { kind: provider })) {
// 		next();
// 	} else {
// 		// res.redirect(`/auth/${provider}`);
// 		res.status(403).send({ message: "You've been signed out" });
// 	}
// };

export default passport;
