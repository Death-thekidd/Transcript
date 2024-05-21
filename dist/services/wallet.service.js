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
exports.processPaystackEvent = exports.verifyPaystackSignature = exports.getWalletByUserId = exports.getAllWallets = void 0;
// src/services/walletService.ts
const crypto_1 = __importDefault(require("crypto"));
const wallet_1 = __importDefault(require("../database/models/wallet"));
const wallettransaction_1 = __importDefault(require("../database/models/wallettransaction"));
const transaction_1 = __importDefault(require("../database/models/transaction"));
const user_1 = __importDefault(require("../database/models/user"));
const secrets_1 = require("../util/secrets");
const _20240510092110_create_wallet_transaction_1 = require("../database/migrations/20240510092110-create-wallet-transaction");
var CurrencyType;
(function (CurrencyType) {
    CurrencyType["NGN"] = "NGN";
})(CurrencyType || (CurrencyType = {}));
var GatewayType;
(function (GatewayType) {
    GatewayType["PAYSTACK"] = "paystack";
})(GatewayType || (GatewayType = {}));
const getAllWallets = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield wallet_1.default.findAll();
});
exports.getAllWallets = getAllWallets;
const getWalletByUserId = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    return yield wallet_1.default.findOne({ where: { userId: userID } });
});
exports.getWalletByUserId = getWalletByUserId;
const verifyPaystackSignature = (reqBody, signature) => {
    const hash = crypto_1.default
        .createHmac("sha512", secrets_1.PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(reqBody))
        .digest("hex");
    return hash === signature;
};
exports.verifyPaystackSignature = verifyPaystackSignature;
const processPaystackEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (event && event.event === "charge.success") {
        const { status, currency, id, amount, customer } = event.data;
        const transactionExist = yield transaction_1.default.findOne({
            where: { transactionId: id },
        });
        if (transactionExist) {
            throw new Error("Transaction Already Exists");
        }
        const user = yield user_1.default.findOne({ where: { email: customer.email } });
        if (!user) {
            throw new Error("User not found");
        }
        const wallet = yield validateUserWallet(user.id);
        yield createWalletTransaction(wallet.id, status, currency, amount, _20240510092110_create_wallet_transaction_1.TransactionType.DEPOSIT);
        yield createTransaction(user.id, id, status, currency, amount, customer);
        yield updateWalletBalance(user.id, amount);
        return wallet;
    }
    throw new Error("Invalid event");
});
exports.processPaystackEvent = processPaystackEvent;
const validateUserWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    let userWallet = yield wallet_1.default.findOne({ where: { userId } });
    if (!userWallet) {
        userWallet = yield wallet_1.default.create({ userId });
    }
    return userWallet;
});
const createWalletTransaction = (walletId, status, currency, amount, type) => __awaiter(void 0, void 0, void 0, function* () {
    return yield wallettransaction_1.default.create({
        amount,
        walletId,
        currency,
        status,
        isInFlow: true,
        transactionType: type,
    });
});
const createTransaction = (userId, id, status, currency, amount, customer) => __awaiter(void 0, void 0, void 0, function* () {
    return yield transaction_1.default.create({
        userId,
        transactionId: id,
        name: customer.name,
        email: customer.email,
        amount,
        currency,
        paymentStatus: status,
        paymentGateway: GatewayType.PAYSTACK,
    });
});
const updateWalletBalance = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_1.default.findOne({ where: { userId } });
    if (wallet) {
        wallet.balance += amount;
        yield wallet.save();
        return wallet;
    }
    throw new Error("Wallet not found");
});
//# sourceMappingURL=wallet.service.js.map