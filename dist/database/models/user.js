"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../connection"));
const transaction_1 = __importDefault(require("./transaction"));
const role_1 = __importDefault(require("./role"));
const wallet_1 = __importDefault(require("./wallet"));
const college_1 = __importDefault(require("./college"));
const department_1 = __importDefault(require("./department"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
    },
    schoolId: sequelize_1.DataTypes.STRING,
    collegeId: sequelize_1.DataTypes.UUID,
    departmentId: sequelize_1.DataTypes.UUID,
    password: sequelize_1.DataTypes.STRING,
    email: sequelize_1.DataTypes.STRING,
    name: sequelize_1.DataTypes.STRING,
    isAdmin: sequelize_1.DataTypes.BOOLEAN,
    resetToken: sequelize_1.DataTypes.STRING,
    resetTokenExpires: sequelize_1.DataTypes.DATE,
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
    modelName: "User",
});
User.hasMany(transaction_1.default, { foreignKey: "userId" });
transaction_1.default.belongsTo(User, {
    foreignKey: "userId",
});
college_1.default.hasMany(User, { foreignKey: "collegeId" });
User.belongsTo(college_1.default, {
    foreignKey: "collegeId",
});
department_1.default.hasMany(User, { foreignKey: "departmentId" });
User.belongsTo(department_1.default, {
    foreignKey: "departmentId",
});
User.belongsToMany(role_1.default, {
    through: "UserRole",
});
role_1.default.belongsToMany(User, {
    through: "UserRole",
});
User.hasOne(wallet_1.default, { foreignKey: "userId" });
wallet_1.default.belongsTo(User, {
    foreignKey: "userId",
});
exports.default = User;
//# sourceMappingURL=user.js.map