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
exports.addPrivilegeToRole = exports.createPrivilege = exports.getPrivilegeById = exports.getAllPrivileges = void 0;
// services/privilegeService.ts
const privilege_1 = __importDefault(require("../database/models/privilege"));
const role_1 = __importDefault(require("../database/models/role"));
const getAllPrivileges = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield privilege_1.default.findAll();
    }
    catch (error) {
        throw error;
    }
});
exports.getAllPrivileges = getAllPrivileges;
const getPrivilegeById = (privilegeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const privilege = yield privilege_1.default.findByPk(privilegeId);
        if (!privilege) {
            throw new Error("Privilege not found");
        }
        return privilege;
    }
    catch (error) {
        throw error;
    }
});
exports.getPrivilegeById = getPrivilegeById;
const createPrivilege = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield privilege_1.default.create({ name });
    }
    catch (error) {
        throw error;
    }
});
exports.createPrivilege = createPrivilege;
const addPrivilegeToRole = (roleName, assignedPrivileges) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const role = yield role_1.default.findOne({ where: { name: roleName } });
        if (!role) {
            throw new Error(`Role '${roleName}' not found.`);
        }
        // Remove all existing privileges associated with the role
        yield role.removePrivileges();
        // Assign the specified privileges to the role
        for (const privilegeName of assignedPrivileges) {
            const associatedPrivilege = yield privilege_1.default.findOne({
                where: { name: privilegeName },
            });
            if (associatedPrivilege) {
                yield role.addPrivilege(associatedPrivilege);
            }
        }
    }
    catch (error) {
        throw error;
    }
});
exports.addPrivilegeToRole = addPrivilegeToRole;
//# sourceMappingURL=privilege.service.js.map