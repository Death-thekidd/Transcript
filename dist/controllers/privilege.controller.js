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
exports.addPrivilegeToRole = exports.createPrivilege = exports.getPrivilege = exports.getPrivileges = void 0;
const express_validator_1 = require("express-validator");
const privilegeService = __importStar(require("../services/privilege.service"));
const getPrivileges = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const privileges = yield privilegeService.getAllPrivileges();
        return res.status(200).json({ data: privileges });
    }
    catch (error) {
        next(error);
    }
});
exports.getPrivileges = getPrivileges;
const getPrivilege = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const privilegeId = req.params.id;
        const privilege = yield privilegeService.getPrivilegeById(privilegeId);
        return res.status(200).json({ data: privilege });
    }
    catch (error) {
        if (error.message === "Privilege not found") {
            return res.status(404).json({ message: error.message });
        }
        next(error);
    }
});
exports.getPrivilege = getPrivilege;
const createPrivilege = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const privilege = yield privilegeService.createPrivilege(req.body.name);
        return res
            .status(200)
            .json({ message: "Privilege created successfully", data: privilege });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.createPrivilege = createPrivilege;
const addPrivilegeToRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { roleName, assignedPrivileges } = req.body;
        yield privilegeService.addPrivilegeToRole(roleName, assignedPrivileges);
        return res.status(204).json({ message: "Privileges added successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.addPrivilegeToRole = addPrivilegeToRole;
//# sourceMappingURL=privilege.controller.js.map