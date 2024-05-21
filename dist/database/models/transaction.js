"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../connection"));
var CurrencyType;
(function (CurrencyType) {
    CurrencyType["NGN"] = "NGN";
})(CurrencyType || (CurrencyType = {}));
var GatewayType;
(function (GatewayType) {
    GatewayType["PAYSTACK"] = "paystack";
})(GatewayType || (GatewayType = {}));
class Transaction extends sequelize_1.Model {
}
Transaction.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    userId: sequelize_1.DataTypes.UUID,
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    amount: { type: sequelize_1.DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    currency: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: CurrencyType.NGN,
    },
    paymentStatus: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    paymentGateway: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: GatewayType.PAYSTACK,
    },
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
    modelName: "Transaction",
});
exports.default = Transaction;
//# sourceMappingURL=transaction.js.map