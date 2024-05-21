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
// src/routes/roleRoutes.ts
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const roleController = __importStar(require("../controllers/role.controller"));
const router = express_1.Router();
router.get("/roles", roleController.getRoles);
router.get("/role/:id", express_validator_1.param("id").isInt().withMessage("Role ID must be an integer"), roleController.getRole);
router.post("/create-role", express_validator_1.body("name").isString().withMessage("Name must be a string"), express_validator_1.body("privileges").isArray().withMessage("Privileges must be an array"), roleController.createRole);
router.patch("/edit-role/:id", express_validator_1.param("id").isInt().withMessage("Role ID must be an integer"), express_validator_1.body("name").isString().withMessage("Name must be a string"), express_validator_1.body("privileges").isArray().withMessage("Privileges must be an array"), roleController.editRole);
router.delete("/delete-role/:id", express_validator_1.param("id").isInt().withMessage("Role ID must be an integer"), roleController.deleteRole);
router.patch("/add-role", express_validator_1.body("userId").isInt().withMessage("User ID must be an integer"), express_validator_1.body("roleId").isInt().withMessage("Role ID must be an integer"), roleController.addRoleToUser);
exports.default = router;
//# sourceMappingURL=role.router.js.map