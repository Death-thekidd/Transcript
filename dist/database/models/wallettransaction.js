"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../connection"));
class WalletTransaction extends sequelize_1.Model {
}
WalletTransaction.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
    },
    amount: sequelize_1.DataTypes.FLOAT,
    walletId: sequelize_1.DataTypes.UUID,
    isInFlow: sequelize_1.DataTypes.BOOLEAN,
    paymentMethod: sequelize_1.DataTypes.STRING,
    currency: sequelize_1.DataTypes.STRING,
    status: sequelize_1.DataTypes.STRING,
    transactionType: sequelize_1.DataTypes.STRING,
}, {
    sequelize: connection_1.default,
    modelName: "WalletTransaction",
});
exports.default = WalletTransaction;
//# sourceMappingURL=wallettransaction.js.map