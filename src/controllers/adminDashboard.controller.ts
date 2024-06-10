import { Request, Response } from "express";
import {
	getMonthlyRevenueAndExpenses,
	getSummary,
	getRecentTransactions,
	getTotalTranscriptRequests,
	getWeeklyTranscriptRequests,
} from "../services/transaction.service";

export async function getAdminDashboardData(
	req: Request,
	res: Response
): Promise<void> {
	try {
		const year = new Date().getFullYear();

		const [
			monthlyData,
			summary,
			recentTransactions,
			transcriptRequestsData,
			weeklyTranscriptRequests,
		] = await Promise.all([
			getMonthlyRevenueAndExpenses(year),
			getSummary(),
			getRecentTransactions(),
			getTotalTranscriptRequests(),
			getWeeklyTranscriptRequests(),
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
	} catch (error) {
		console.error("Error fetching admin dashboard data:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
}
