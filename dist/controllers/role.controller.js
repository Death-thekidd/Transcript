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
exports.createRole = exports.getRole = exports.getRoles = void 0;
const role_model_1 = require("../models/role.model");
const express_validator_1 = require("express-validator");
/**
 * Get all roles
 * @route GET /roles
 */
const getRoles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield role_model_1.Role.findAll();
        return res.status(200).json({ data: roles });
    }
    catch (error) {
        next(error);
    }
});
exports.getRoles = getRoles;
/**
 * Get role by ID
 * @route GET /role/:id
 */
const getRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roleId = req.params.id;
        const role = yield role_model_1.Role.findByPk(roleId);
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
/**
 * Create new Role
 * @route POST /create-role
 */
const createRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            // Return validation errors as JSON
            return res.status(400).json({ errors: errors.array() });
        }
        const role = yield role_model_1.Role.create({
            name: req.body.name,
        });
        return res
            .status(200)
            .json({ message: "Role created succesfully", data: role });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.createRole = createRole;
//# sourceMappingURL=role.controller.js.map