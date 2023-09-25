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
exports.init = exports.User = exports.initUserModel = exports.UserType = void 0;
const sequelize_1 = require("sequelize");
const bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
const sequelize_2 = __importDefault(require("../sequelize"));
const wallet_model_1 = require("./wallet.model");
const walletTransaction_model_1 = require("./walletTransaction.model");
const transaction_model_1 = require("./transaction.model");
const role_model_1 = require("./role.model");
// Define the UserType enum
var UserType;
(function (UserType) {
    UserType["Student"] = "Student";
    UserType["Staff"] = "Staff";
})(UserType = exports.UserType || (exports.UserType = {}));
const initUserModel = (sequelize) => {
    const User = sequelize.define("User", {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
        },
        schoolId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
        name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        department: { type: sequelize_1.DataTypes.STRING },
        college: { type: sequelize_1.DataTypes.STRING },
        collegeID: { type: sequelize_1.DataTypes.UUID },
        departmentID: { type: sequelize_1.DataTypes.UUID },
        userType: { type: sequelize_1.DataTypes.STRING, allowNull: false },
        passwordResetToken: { type: sequelize_1.DataTypes.STRING },
        passwordResetExpires: { type: sequelize_1.DataTypes.DATE },
        isAdmin: { type: sequelize_1.DataTypes.BOOLEAN },
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
    return User;
};
exports.initUserModel = initUserModel;
exports.User = exports.initUserModel(sequelize_2.default);
exports.User.hasOne(wallet_model_1.Wallet, { foreignKey: "UserID", as: "Wallet" });
wallet_model_1.Wallet.belongsTo(exports.User, {
    foreignKey: "UserID",
    constraints: false,
    as: "User",
});
exports.User.hasOne(transaction_model_1.Transaction, { foreignKey: "UserID", as: "Transaction" });
transaction_model_1.Transaction.belongsTo(exports.User, {
    foreignKey: "UserID",
    constraints: false,
    as: "User",
});
exports.User.hasOne(walletTransaction_model_1.WalletTransaction, {
    foreignKey: "UserID",
    as: "WalletTransaction",
});
walletTransaction_model_1.WalletTransaction.belongsTo(exports.User, {
    foreignKey: "UserID",
    constraints: false,
    as: "User",
});
exports.User.belongsToMany(role_model_1.Role, {
    through: "user_roles",
    foreignKey: "userId",
});
role_model_1.Role.belongsToMany(exports.User, {
    through: "user_roles",
    foreignKey: "roleId",
});
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.User.sequelize.sync();
            // console.log("Database and tables synced successfully");
        }
        catch (error) {
            console.error("Error syncing database:", error);
        }
    });
}
exports.init = init;
//# sourceMappingURL=user.model.js.map