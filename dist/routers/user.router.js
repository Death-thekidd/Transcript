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
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const userController = __importStar(require("../controllers/user.controller"));
const router = express_1.Router();
router.get("/users", userController.getUsers);
router.get("/user/:id", express_validator_1.param("id").isString().withMessage("User ID must be a string"), userController.getUser);
router.patch("/update-user/:id", express_validator_1.param("id").isString().withMessage("User ID must be a string"), express_validator_1.body("email").isEmail().withMessage("Please enter a valid email address."), express_validator_1.body("email").normalizeEmail({ gmail_remove_dots: false }), userController.updateUser);
router.delete("/delete-user/:id", express_validator_1.param("id").isString().withMessage("User ID must be a string"), userController.deleteUser);
exports.default = router;
//# sourceMappingURL=user.router.js.map