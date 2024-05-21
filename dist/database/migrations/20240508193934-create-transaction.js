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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
var CurrencyType;
(function (CurrencyType) {
    CurrencyType["NGN"] = "NGN";
})(CurrencyType || (CurrencyType = {}));
var GatewayType;
(function (GatewayType) {
    GatewayType["PAYSTACK"] = "paystack";
})(GatewayType || (GatewayType = {}));
module.exports = {
    up(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.createTable("Transactions", {
                id: {
                    type: sequelize_1.DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                userId: {
                    type: Sequelize.UUID,
                    allowNull: false,
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                email: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                amount: {
                    type: Sequelize.FLOAT,
                    allowNull: false,
                },
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
                    type: Sequelize.DATE,
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
            });
        });
    },
    down(queryInterface) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.dropTable("Transactions");
        });
    },
};
//# sourceMappingURL=20240508193934-create-transaction.js.map