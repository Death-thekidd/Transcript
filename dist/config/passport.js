"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
// import { User, UserType } from '../models/User';
const user_1 = __importDefault(require("../database/models/user"));
const LocalStrategy = passport_local_1.default.Strategy;
passport_1.default.serializeUser((req, user, done) => {
    done(undefined, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findByPk(id);
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
}));
/**
 * Sign in using Email and Password.
 */
passport_1.default.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({
            where: { email: email.toLowerCase() },
        });
        if (!user) {
            return done(undefined, false, {
                message: `Email ${email} not found.`,
            });
        }
        user.comparePassword(password, (err, isMatch) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                return done(undefined, user);
            }
            return done(undefined, false, {
                message: "Invalid email or password.",
            });
        }));
    }
    catch (err) {
        if (err) {
            return done(err);
        }
    }
})));
/**
 * Login Required middleware.
 */
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(403).send({ message: "You've been signed out" });
};
exports.isAuthenticated = isAuthenticated;
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
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map