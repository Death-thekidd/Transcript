"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../connection"));
const privilege_1 = __importDefault(require("./privilege"));
class Role extends sequelize_1.Model {
}
Role.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
    },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    createdAt: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
    },
    updatedAt: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
    },
}, {
    sequelize: connection_1.default,
    modelName: "Role",
});
Role.belongsToMany(privilege_1.default, {
    through: "RolePrivileges",
});
privilege_1.default.belongsToMany(Role, {
    through: "RolePrivileges",
});
exports.default = Role;
//# sourceMappingURL=role.js.map