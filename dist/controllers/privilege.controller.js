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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPrivildege = exports.createPrivilege = exports.getPrivilege = exports.getPrivileges = void 0;
const role_model_1 = require("../models/role.model");
const express_validator_1 = require("express-validator");
const privilege_model_1 = require("../models/privilege.model");
/**
 * Get all privileges
 * @route GET /privileges
 */
const getPrivileges = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const privileges = yield privilege_model_1.Privilege.findAll();
        return res.status(200).json({ data: privileges });
    }
    catch (error) {
        next(error);
    }
});
exports.getPrivileges = getPrivileges;
/**
 * Get privilege by ID
 * @route GET /privilege/:id
 */
const getPrivilege = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const privilegeId = req.params.id;
        const privilege = yield role_model_1.Role.findByPk(privilegeId);
        if (!privilege) {
            return res.status(404).json({ message: "Privilege not found" });
        }
        return res.status(200).json({ data: privilege });
    }
    catch (error) {
        next(error);
    }
});
exports.getPrivilege = getPrivilege;
/**
 * Create new Privilege
 * @route POST /create-privilege
 */
const createPrivilege = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            // Return validation errors as JSON
            return res.status(400).json({ errors: errors.array() });
        }
        const privilege = yield privilege_model_1.Privilege.create({
            name: req.body.name,
        });
        return res
            .status(200)
            .json({ message: "Privilege created succesfully", data: privilege });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.createPrivilege = createPrivilege;
/**
 * Add privilege to Role
 * @route PATCH /add-privilege
 */
const addPrivildege = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            // Return validation errors as JSON
            return res.status(400).json({ errors: errors.array() });
        }
        const { roleName, assignedPrivileges } = req.body;
        // Find the role by name
        const role = yield role_model_1.Role.findOne({ where: { name: roleName } });
        if (!role) {
            console.log(`Role '${roleName}' not found.`);
            return;
        }
        // Remove all existing privileges associated with the role
        yield role.removePrivileges();
        // Assign the specified privileges to the role
        for (const privilege of assignedPrivileges) {
            const associatedPrivilege = yield privilege_model_1.Privilege.findOne({
                where: { name: privilege },
            });
            if (associatedPrivilege) {
                yield role.addPrivilege(associatedPrivilege);
            }
        }
        return res.status(204).json({ message: "Priviledges added succesfully" });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.addPrivildege = addPrivildege;
//# sourceMappingURL=privilege.controller.js.map