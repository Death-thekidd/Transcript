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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRoleToUser = exports.deleteRole = exports.updateRole = exports.createRole = exports.getRoleById = exports.getAllRoles = void 0;
// src/services/roleService.ts
const role_1 = __importDefault(require("../database/models/role"));
const privilege_1 = __importDefault(require("../database/models/privilege"));
const user_1 = __importDefault(require("../database/models/user"));
function getAllRoles() {
    return __awaiter(this, void 0, void 0, function* () {
        const roles = yield role_1.default.findAll({
            include: privilege_1.default,
        });
        return roles.map((role) => ({
            id: role.id,
            name: role.name,
            privileges: role.Privileges.map((privilege) => privilege.name),
        }));
    });
}
exports.getAllRoles = getAllRoles;
function getRoleById(roleId) {
    return __awaiter(this, void 0, void 0, function* () {
        const role = yield role_1.default.findByPk(roleId, {
            include: privilege_1.default,
        });
        if (!role) {
            return null;
        }
        return {
            id: role.id,
            name: role.name,
            privileges: role.Privileges.map((privilege) => privilege.name),
        };
    });
}
exports.getRoleById = getRoleById;
function createRole(name, privileges) {
    return __awaiter(this, void 0, void 0, function* () {
        const role = yield role_1.default.create({ name });
        yield assignPrivilegesToRole(role, privileges);
        return {
            id: role.id,
            name: role.name,
            privileges,
        };
    });
}
exports.createRole = createRole;
function updateRole(roleId, name, privileges) {
    return __awaiter(this, void 0, void 0, function* () {
        const role = yield role_1.default.findByPk(roleId);
        if (!role) {
            return null;
        }
        role.name = name;
        yield role.save();
        yield assignPrivilegesToRole(role, privileges);
        return {
            id: role.id,
            name: role.name,
            privileges,
        };
    });
}
exports.updateRole = updateRole;
function deleteRole(roleId) {
    return __awaiter(this, void 0, void 0, function* () {
        const role = yield role_1.default.findByPk(roleId);
        if (!role) {
            return false;
        }
        yield role.destroy();
        return true;
    });
}
exports.deleteRole = deleteRole;
function addRoleToUser(userId, roleId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_1.default.findByPk(userId);
        const role = yield role_1.default.findByPk(roleId);
        if (!user || !role) {
            return false;
        }
        yield user.addRole(role);
        return true;
    });
}
exports.addRoleToUser = addRoleToUser;
function assignPrivilegesToRole(role, privileges) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!role || !Array.isArray(privileges) || privileges.length === 0) {
            return;
        }
        yield role.removePrivileges();
        for (const privilege of privileges) {
            const associatedPrivilege = yield privilege_1.default.findOne({
                where: { name: privilege },
            });
            if (associatedPrivilege) {
                yield role.addPrivilege(associatedPrivilege);
            }
        }
    });
}
//# sourceMappingURL=role.service.js.map