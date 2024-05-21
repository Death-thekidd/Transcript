"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../connection"));
const wallettransaction_1 = __importDefault(require("./wallettransaction"));
class Wallet extends sequelize_1.Model {
}
Wallet.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
    },
    userId: sequelize_1.DataTypes.UUID,
    balance: { type: sequelize_1.DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
}, {
    sequelize: connection_1.default,
    modelName: "Wallet",
});
Wallet.hasMany(wallettransaction_1.default, {
    foreignKey: "walletId",
});
wallettransaction_1.default.belongsTo(Wallet, {
    foreignKey: "walletId",
});
exports.default = Wallet;
//# sourceMappingURL=wallet.js.map