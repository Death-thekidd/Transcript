"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../connection"));
class UserRole extends sequelize_1.Model {
}
UserRole.init({
    userId: sequelize_1.DataTypes.UUID,
    roleId: sequelize_1.DataTypes.UUID,
}, {
    sequelize: connection_1.default,
    modelName: "UserRole",
});
exports.default = UserRole;
//# sourceMappingURL=userrole.js.map