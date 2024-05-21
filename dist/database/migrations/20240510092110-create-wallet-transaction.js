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
exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType["DEPOSIT"] = "deposit";
    TransactionType["PAYMENT"] = "payment";
})(TransactionType = exports.TransactionType || (exports.TransactionType = {}));
var CurrencyType;
(function (CurrencyType) {
    CurrencyType["NGN"] = "NGN";
})(CurrencyType || (CurrencyType = {}));
var GatewayType;
(function (GatewayType) {
    GatewayType["PAYSTACK"] = "paystack";
})(GatewayType || (GatewayType = {}));
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.createTable("WalletTransactions", {
                id: {
                    allowNull: false,
                    autoIncrement: false,
                    primaryKey: true,
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                },
                amount: {
                    type: Sequelize.FLOAT,
                    allowNull: false,
                    defaultValue: 0,
                },
                walletId: {
                    type: Sequelize.UUID,
                },
                isInFlow: {
                    type: Sequelize.BOOLEAN,
                },
                paymentMethod: {
                    type: Sequelize.STRING,
                    defaultValue: GatewayType.PAYSTACK,
                },
                currency: {
                    type: Sequelize.STRING,
                    defaultValue: CurrencyType.NGN,
                },
                status: {
                    type: Sequelize.STRING,
                },
                transactionType: {
                    type: Sequelize.STRING,
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
            yield queryInterface.dropTable("WalletTransactions");
        });
    },
};
//# sourceMappingURL=20240510092110-create-wallet-transaction.js.map