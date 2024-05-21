"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../connection"));
const department_1 = __importDefault(require("./department"));
class College extends sequelize_1.Model {
}
College.init({
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
    modelName: "College",
});
College.hasMany(department_1.default, {
    foreignKey: "collegeId",
    onDelete: "CASCADE",
});
department_1.default.belongsTo(College, {
    foreignKey: "collegeId",
    onDelete: "CASCADE",
});
exports.default = College;
//# sourceMappingURL=college.js.map