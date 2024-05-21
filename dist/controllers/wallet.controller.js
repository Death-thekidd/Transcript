"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.verifyPayment = exports.getWallet = exports.getWallets = void 0;
const walletService = __importStar(require("../services/wallet.service"));
/**
 * Get all Wallets
 * @route GET /wallets
 */
const getWallets = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallets = yield walletService.getAllWallets();
        return res.status(200).json({ data: wallets });
    }
    catch (error) {
        next(error);
    }
});
exports.getWallets = getWallets;
/**
 * Get Wallet by UserID
 * @route GET /wallet/:id
 */
const getWallet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.params.id;
        const wallet = yield walletService.getWalletByUserId(userID);
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }
        return res.status(200).json({ data: wallet });
    }
    catch (error) {
        next(error);
    }
});
exports.getWallet = getWallet;
/**
 * Paystack webhook url
 * @route POST /verify-transaction
 */
const verifyPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isValid = walletService.verifyPaystackSignature(req.body, req.headers["x-paystack-signature"]);
        if (!isValid) {
            return res.status(400).json({ message: "Invalid signature" });
        }
        const wallet = yield walletService.processPaystackEvent(req.body);
        return res
            .status(200)
            .json({ message: "Wallet funded successfully", data: wallet });
    }
    catch (error) {
        if (error.message === "Transaction Already Exists") {
            return res.status(409).json({ message: error.message });
        }
        next(error);
    }
});
exports.verifyPayment = verifyPayment;
//# sourceMappingURL=wallet.controller.js.map