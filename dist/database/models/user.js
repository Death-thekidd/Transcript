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
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../connection"));
const transaction_1 = __importDefault(require("./transaction"));
const role_1 = __importDefault(require("./role"));
const wallet_1 = __importDefault(require("./wallet"));
const college_1 = __importDefault(require("./college"));
const department_1 = __importDefault(require("./department"));
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
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
// Password hash middleware
User.beforeCreate((user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.password) {
        const salt = bcrypt_nodejs_1.default.genSaltSync(10);
        user.password = bcrypt_nodejs_1.default.hashSync(user.password, salt);
    }
}));
// Method to compare passwords
User.prototype.comparePassword = function (candidatePassword, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        cb(undefined, bcrypt_nodejs_1.default.compareSync(candidatePassword, this.password));
    });
};
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