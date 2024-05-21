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
exports.addRoleToUser = exports.deleteRole = exports.editRole = exports.createRole = exports.getRole = exports.getRoles = void 0;
const express_validator_1 = require("express-validator");
const roleService = __importStar(require("../services/role.service"));
const getRoles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield roleService.getAllRoles();
        return res.status(200).json({ data: roles });
    }
    catch (error) {
        next(error);
    }
});
exports.getRoles = getRoles;
const getRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roleId = parseInt(req.params.id);
        const role = yield roleService.getRoleById(roleId);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }
        return res.status(200).json({ data: role });
    }
    catch (error) {
        next(error);
    }
});
exports.getRole = getRole;
const createRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, privileges } = req.body;
        const role = yield roleService.createRole(name, privileges);
        return res
            .status(200)
            .json({ message: "Role created successfully", data: role });
    }
    catch (error) {
        next(error);
    }
});
exports.createRole = createRole;
const editRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const roleId = parseInt(req.params.id);
        const { name, privileges } = req.body;
        const role = yield roleService.updateRole(roleId, name, privileges);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }
        return res
            .status(200)
            .json({ message: "Role updated successfully", data: role });
    }
    catch (error) {
        next(error);
    }
});
exports.editRole = editRole;
const deleteRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roleId = parseInt(req.params.id);
        const deleted = yield roleService.deleteRole(roleId);
        if (!deleted) {
            return res.status(404).json({ message: "Role not found" });
        }
        return res.status(200).json({ message: "Role deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteRole = deleteRole;
const addRoleToUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { userId, roleId } = req.body;
        const added = yield roleService.addRoleToUser(userId, roleId);
        if (!added) {
            return res.status(404).json({ message: "User or Role not found" });
        }
        return res.status(200).json({ message: "Role added successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.addRoleToUser = addRoleToUser;
//# sourceMappingURL=role.controller.js.map