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
exports.getAdminDashboardData = void 0;
const transaction_service_1 = require("../services/transaction.service");
function getAdminDashboardData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const year = new Date().getFullYear();
            const [monthlyData, summary, recentTransactions, transcriptRequestsData, weeklyTranscriptRequests,] = yield Promise.all([
                transaction_service_1.getMonthlyRevenueAndExpenses(year),
                transaction_service_1.getSummary(),
                transaction_service_1.getRecentTransactions(),
                transaction_service_1.getTotalTranscriptRequests(),
                transaction_service_1.getWeeklyTranscriptRequests(),
            ]);
            res.json({
                monthlyRevenue: monthlyData.revenue,
                monthlyExpenses: monthlyData.expenses,
                summary,
                recentTransactions,
                totalTranscriptRequests: transcriptRequestsData.totalRequests,
                monthlyTranscriptRequests: transcriptRequestsData.monthlyRequests,
                weeklyTranscriptRequests,
            });
        }
        catch (error) {
            console.error("Error fetching admin dashboard data:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    });
}
exports.getAdminDashboardData = getAdminDashboardData;
//# sourceMappingURL=adminDashboard.controller.js.map