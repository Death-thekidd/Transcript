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
// routes/privilegeRoutes.ts
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const privilegeController = __importStar(require("../controllers/privilege.controller"));
const router = express_1.Router();
router.get("/privileges", privilegeController.getPrivileges);
router.get("/privilege/:id", privilegeController.getPrivilege);
router.post("/create-privilege", express_validator_1.body("name").notEmpty().withMessage("Name is required"), privilegeController.createPrivilege);
router.patch("/add-privilege", express_validator_1.body("roleName").notEmpty().withMessage("Role name is required"), express_validator_1.body("assignedPrivileges")
    .isArray()
    .withMessage("Privileges should be an array"), privilegeController.addPrivilegeToRole);
exports.default = router;
//# sourceMappingURL=privilege.router.js.map