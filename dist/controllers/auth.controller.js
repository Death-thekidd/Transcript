"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getStatus = exports.postForgot = exports.postReset = exports.postSignup = exports.logout = exports.postLogin = void 0;
const express_validator_1 = require("express-validator");
const passport_1 = __importDefault(require("passport"));
const authService = __importStar(require("../services/auth.service"));
/**
 * Sign in using email and password.
 * @route POST /login
 */
const postLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield express_validator_1.check("email", "Email is not valid").isEmail().run(req);
    yield express_validator_1.check("password", "Password cannot be blank")
        .isLength({ min: 1 })
        .run(req);
    yield express_validator_1.body("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }
    passport_1.default.authenticate("local", (err, user, info) => {
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
    })(req, res, next);
});
exports.postLogin = postLogin;
/**
 * Log out.
 * @route POST /logout
 */
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.logout();
    return res.status(200).json({ message: "Success! You are logged out." });
});
exports.logout = logout;
/**
 * Create a new local account.
 * @route POST /signup
 */
const postSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield express_validator_1.check("email", "Email is not valid").isEmail().run(req);
        yield express_validator_1.check("password", "Password must be at least 4 characters long")
            .isLength({ min: 4 })
            .run(req);
        yield express_validator_1.body("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        yield authService.createUser(req.body);
        return res.status(201).json({ message: "User registered successfully." });
    }
    catch (error) {
        console.error("Unable to create User record:", error);
        return res.status(500).json({ error: error.message });
    }
});
exports.postSignup = postSignup;
/**
 * Process the reset password request.
 * @route POST /reset/:token
 */
const postReset = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield express_validator_1.check("password", "Password must be at least 4 characters long.")
        .isLength({ min: 4 })
        .run(req);
    yield express_validator_1.check("confirm", "Passwords must match.")
        .equals(req.body.password)
        .run(req);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = yield authService.resetPassword(req.params.token, req.body.password);
        yield authService.sendResetPasswordEmail(user);
        return res
            .status(200)
            .json({ message: "Password reset email sent successfully." });
    }
    catch (error) {
        next(error);
    }
});
exports.postReset = postReset;
/**
 * Create a random token, then send the user an email with a reset link.
 * @route POST /forgot
 */
const postForgot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield express_validator_1.check("email", "Please enter a valid email address.").isEmail().run(req);
    yield express_validator_1.body("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const token = yield authService.createRandomToken();
        const user = yield authService.setResetToken(req.body.email, token);
        yield authService.sendForgotPasswordEmail(user, token, req.headers.host);
        return res
            .status(200)
            .json({ message: "An e-mail has been sent with further instructions." });
    }
    catch (error) {
        next(error);
    }
});
exports.postForgot = postForgot;
/**
 * Gets user authentication status
 * @route GET /status
 */
const getStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.isAuthenticated()) {
        return res.json({
            valid: true,
            userId: req.user.id,
        });
    }
    else {
        return res.json({ valid: false });
    }
});
exports.getStatus = getStatus;
//# sourceMappingURL=auth.controller.js.map