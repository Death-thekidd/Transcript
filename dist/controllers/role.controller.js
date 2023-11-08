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
exports.addRole = exports.deleteRole = exports.editRole = exports.createRole = exports.getRole = exports.getRoles = void 0;
const role_model_1 = require("../models/role.model");
const express_validator_1 = require("express-validator");
const user_model_1 = require("../models/user.model");
const privilege_model_1 = require("../models/privilege.model");
/**
 * Get all roles
 * @route GET /roles
 */
const getRoles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield role_model_1.Role.findAll({
            include: privilege_model_1.Privilege, // Include the Privilege model to fetch associated privileges
        });
        // Map the roles and format the response
        const rolesWithPrivileges = roles.map((role) => {
            return {
                id: role.id,
                name: role.name,
                privileges: role.Privileges.map((privilege) => privilege.name),
                // Add other role properties if needed
            };
        });
        return res.status(200).json({ data: rolesWithPrivileges });
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
/**
 * Get role by ID
 * @route GET /role/:id
 */
const getRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roleId = req.params.id;
        const role = yield role_model_1.Role.findByPk(roleId, {
            include: privilege_model_1.Privilege, // Include the Privilege model to fetch associated privileges
        });
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }
        // Format the response to include privileges
        const roleWithPrivileges = {
            id: role.id,
            name: role.name,
            privileges: role.Privileges.map((privilege) => privilege.name),
            // Add other role properties if needed
        };
        return res.status(200).json({ data: roleWithPrivileges });
    }
    catch (error) {
        next(error);
    }
});
exports.getRole = getRole;
function assignPrivilegesToRole(role, privileges) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Ensure that the role and privileges are valid
            if (!role || !Array.isArray(privileges) || privileges.length === 0) {
                return;
            }
            // Remove all existing privileges associated with the role
            yield role.removePrivileges();
            // Assign the specified privileges to the role
            for (const privilege of privileges) {
                const associatedPrivilege = yield privilege_model_1.Privilege.findOne({
                    where: { name: privilege },
                });
                if (associatedPrivilege) {
                    yield role.addPrivilege(associatedPrivilege);
                }
            }
        }
        catch (error) {
            console.error("Error assigning privileges to role:", error);
        }
    });
}
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
        // Check if privileges were provided in the request body
        if (Array.isArray(req.body.privileges) && req.body.privileges.length > 0) {
            // Assign the specified privileges to the newly created role
            yield assignPrivilegesToRole(role, req.body.privileges);
        }
        return res
            .status(200)
            .json({ message: "Role created succesfully", data: role });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.createRole = createRole;
/**
 * Edit Role
 * @route PATCH /edit-role
 */
const editRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const roleId = req.params.id;
    const { name, privileges } = req.body; // You can pass the new name and updated privileges here
    try {
        const role = yield role_model_1.Role.findByPk(roleId);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }
        // Update the role attributes
        role.name = name;
        yield role.save();
        // Update privileges (if needed)
        if (privileges) {
            assignPrivilegesToRole(role, privileges);
        }
        return res.status(200).json({ message: "Role updated successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.editRole = editRole;
/**
 * Delete Role
 * @route DELET6E /delete-role
 */
const deleteRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const roleId = req.params.id;
    try {
        const role = yield role_model_1.Role.findByPk(roleId);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }
        // Remove the role and its associations
        yield role.destroy();
        return res.status(200).json({ message: "Role deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.deleteRole = deleteRole;
/**
 * Add Role to User
 * @route PATCH /add-role
 */
const addRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            // Return validation errors as JSON
            return res.status(400).json({ errors: errors.array() });
        }
        const { userId } = req.params;
        const { roleId } = req.body;
        const user = yield user_model_1.User.findByPk(userId);
        const role = yield role_model_1.Role.findByPk(roleId);
        if (!user) {
            throw new Error("User not found");
        }
        if (!role) {
            throw new Error("Role not found");
        }
        yield user.addRole(role);
        return res.status(204).json({ message: "Role added succesfully" });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.addRole = addRole;
//# sourceMappingURL=role.controller.js.map