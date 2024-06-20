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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = void 0;
const express_validator_1 = require("express-validator");
const userService = __importStar(require("../services/user.service"));
/**
 * Get all users
 * @route GET /users
 */
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userService.getAllUsers();
        const usersWithRolesAndPrivileges = yield Promise.all(users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            const roles = yield user.getRoles();
            const privileges = [];
            for (const role of roles) {
                const rolePrivileges = yield role.getPrivileges();
                for (const privilege of rolePrivileges) {
                    if (!privileges.some((p) => p.name === privilege.name)) {
                        privileges.push(privilege);
                    }
                }
            }
            return Object.assign(Object.assign({}, user.dataValues), { privileges, roles: roles.map((role) => role === null || role === void 0 ? void 0 : role.name) });
        })));
        return res.status(200).json({ data: usersWithRolesAndPrivileges });
    }
    catch (error) {
        next(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getUsers = getUsers;
/**
 * Get User by ID
 * @route GET /user/:id
 */
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield userService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const roles = yield user.getRoles();
        const privileges = [];
        for (const role of roles) {
            const rolePrivileges = yield role.getPrivileges();
            for (const privilege of rolePrivileges) {
                if (!privileges.some((p) => p.name === privilege.name)) {
                    privileges.push(privilege);
                }
            }
        }
        return res.status(200).json({
            data: Object.assign(Object.assign({}, user.dataValues), { privileges, roles: roles.map((role) => role === null || role === void 0 ? void 0 : role.name) }),
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getUser = getUser;
/**
 * Update profile information.
 * @route PATCH /update-user/:id
 */
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield express_validator_1.check("email", "Please enter a valid email address.").isEmail().run(req);
    yield express_validator_1.body("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        yield userService.updateUser(req.params.id, req.body);
        return res
            .status(200)
            .json({ message: "Profile information has been updated." });
    }
    catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({
                error: "The email address is already associated with an account.",
            });
        }
        next(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.updateUser = updateUser;
/**
 * Delete user account.
 * @route DELETE /delete-user/:id
 */
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        yield userService.deleteUserById(userId);
        req.logout();
        return res.status(200).json({ message: "Your account has been deleted" });
    }
    catch (error) {
        next(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.controller.js.map