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
exports.deleteUserById = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
// src/services/userService.ts
const user_1 = __importDefault(require("../database/models/user"));
const role_1 = __importDefault(require("../database/models/role"));
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
const college_1 = __importDefault(require("../database/models/college"));
const department_1 = __importDefault(require("../database/models/department"));
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_1.default.findAll({ include: [role_1.default, college_1.default, department_1.default] });
});
exports.getAllUsers = getAllUsers;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_1.default.findByPk(id, { include: [role_1.default, college_1.default, department_1.default] });
});
exports.getUserById = getUserById;
const updateUser = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ where: { id: userId } });
    if (!user) {
        throw new Error("User not found");
    }
    if (userData.password) {
        const salt = bcrypt_nodejs_1.default.genSaltSync(10);
        const hashedPassword = bcrypt_nodejs_1.default.hashSync(userData.password, salt);
        user.password = hashedPassword;
    }
    user.email = userData.email || user.email;
    user.name = userData.name || user.name;
    user.departmentId = userData.department || user.departmentId;
    user.collegeId = userData.college || user.collegeId;
    yield user.save();
    if (userData.roles) {
        const newRoles = userData.roles;
        const currentRoles = yield user.getRoles();
        for (const currentRole of currentRoles) {
            if (!newRoles.includes(currentRole.name)) {
                yield user.removeRole(currentRole);
            }
        }
        for (const role of newRoles) {
            const defaultRole = yield role_1.default.findOne({ where: { name: role } });
            if (defaultRole) {
                const hasRole = currentRoles.some((currentRole) => currentRole.name === role);
                if (!hasRole) {
                    yield user.addRole(defaultRole);
                }
            }
        }
    }
});
exports.updateUser = updateUser;
const deleteUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findByPk(id);
    if (!user) {
        throw new Error("User not found");
    }
    yield user.destroy();
});
exports.deleteUserById = deleteUserById;
//# sourceMappingURL=user.service.js.map