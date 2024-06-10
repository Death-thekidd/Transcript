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
exports.getWeeklyTranscriptRequests = exports.getTotalTranscriptRequests = exports.getRecentTransactions = exports.getSummary = exports.getMonthlyRevenueAndExpenses = exports.getTransactionById = exports.getAllTransactions = void 0;
// src/services/transactionService.ts
const sequelize_1 = require("sequelize");
const transaction_1 = __importDefault(require("../database/models/transaction"));
const transcriptrequest_1 = __importDefault(require("../database/models/transcriptrequest"));
const user_1 = __importDefault(require("../database/models/user"));
function getAllTransactions() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield transaction_1.default.findAll();
    });
}
exports.getAllTransactions = getAllTransactions;
function getTransactionById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield transaction_1.default.findByPk(id);
    });
}
exports.getTransactionById = getTransactionById;
// Helper function to get the start of a week (Sunday)
const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
};
// Helper function to get the end of a week (Saturday)
const getEndOfWeek = (startOfWeek) => {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
};
function getMonthlyRevenueAndExpenses(year) {
    return __awaiter(this, void 0, void 0, function* () {
        const revenue = [];
        const expenses = [];
        for (let month = 0; month < 12; month++) {
            const startOfMonth = new Date(year, month, 1);
            const endOfMonth = new Date(year, month + 1, 0);
            const monthRevenue = yield transaction_1.default.sum("amount", {
                where: {
                    paymentStatus: "paid",
                    createdAt: {
                        [sequelize_1.Op.between]: [startOfMonth, endOfMonth],
                    },
                },
            });
            const monthExpenses = 0; // Update this with your expenses logic if you have one
            revenue.push(monthRevenue || 0);
            expenses.push(monthExpenses);
        }
        return { revenue, expenses };
    });
}
exports.getMonthlyRevenueAndExpenses = getMonthlyRevenueAndExpenses;
function getSummary() {
    return __awaiter(this, void 0, void 0, function* () {
        const totalRevenue = (yield transaction_1.default.sum("amount", {
            where: {
                paymentStatus: "paid",
            },
        })) || 0;
        const totalExpenses = 0; // Update this with your expenses logic if you have one
        const profit = totalRevenue - totalExpenses;
        return { totalRevenue, totalExpenses, profit };
    });
}
exports.getSummary = getSummary;
function getRecentTransactions(limit = 4) {
    return __awaiter(this, void 0, void 0, function* () {
        const transactions = yield transaction_1.default.findAll({
            limit,
            order: [["createdAt", "DESC"]],
            include: [user_1.default],
        });
        return transactions.map((transaction) => {
            var _a;
            return ({
                name: ((_a = transaction.User) === null || _a === void 0 ? void 0 : _a.name) || "Unknown",
                createdAt: transaction.createdAt,
            });
        });
    });
}
exports.getRecentTransactions = getRecentTransactions;
function getTotalTranscriptRequests() {
    return __awaiter(this, void 0, void 0, function* () {
        // Get total number of transcript requests
        const totalRequests = yield transcriptrequest_1.default.count();
        // Get monthly transcript requests for the current year
        const monthlyRequests = [];
        const currentYear = new Date().getFullYear();
        for (let month = 0; month < 12; month++) {
            const startOfMonth = new Date(currentYear, month, 1);
            const endOfMonth = new Date(currentYear, month + 1, 0);
            const monthlyCount = yield transcriptrequest_1.default.count({
                where: {
                    createdAt: {
                        [sequelize_1.Op.between]: [startOfMonth, endOfMonth],
                    },
                },
            });
            monthlyRequests.push(monthlyCount);
        }
        return { totalRequests, monthlyRequests };
    });
}
exports.getTotalTranscriptRequests = getTotalTranscriptRequests;
function getWeeklyTranscriptRequests() {
    return __awaiter(this, void 0, void 0, function* () {
        const today = new Date();
        // Calculate the start and end of the current week
        const startOfCurrentWeek = getStartOfWeek(today);
        const endOfCurrentWeek = getEndOfWeek(startOfCurrentWeek);
        // Calculate the start and end of the last week
        const startOfLastWeek = new Date(startOfCurrentWeek);
        startOfLastWeek.setDate(startOfCurrentWeek.getDate() - 7);
        const endOfLastWeek = getEndOfWeek(startOfLastWeek);
        // Fetch requests for the last week
        const lastWeekRequests = yield transcriptrequest_1.default.findAll({
            where: {
                createdAt: {
                    [sequelize_1.Op.between]: [startOfLastWeek, endOfLastWeek],
                },
            },
        });
        // Fetch requests for the current week
        const currentWeekRequests = yield transcriptrequest_1.default.findAll({
            where: {
                createdAt: {
                    [sequelize_1.Op.between]: [startOfCurrentWeek, endOfCurrentWeek],
                },
            },
        });
        // Organize requests by day
        const organizeRequestsByDay = (requests, startOfWeek) => {
            startOfWeek; // This is the start of the week
            const dailyCounts = Array(7).fill(0); // Array to hold counts for each day of the week
            requests.forEach((request) => {
                const dayOfWeek = new Date(request.createdAt).getDay();
                dailyCounts[dayOfWeek]++;
            });
            return dailyCounts;
        };
        return {
            lastWeek: organizeRequestsByDay(lastWeekRequests, startOfLastWeek),
            currentWeek: organizeRequestsByDay(currentWeekRequests, startOfCurrentWeek),
        };
    });
}
exports.getWeeklyTranscriptRequests = getWeeklyTranscriptRequests;
//# sourceMappingURL=transaction.service.js.map