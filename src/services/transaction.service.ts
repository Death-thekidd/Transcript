// src/services/transactionService.ts
import { Op } from "sequelize";
import Transaction from "../database/models/transaction";
import TranscriptRequest from "../database/models/transcriptrequest";
import User from "../database/models/user";

export async function getAllTransactions(): Promise<Transaction[]> {
	return await Transaction.findAll();
}

export async function getTransactionById(
	id: string
): Promise<Transaction | null> {
	return await Transaction.findByPk(id);
}

// Helper function to get the start of a week (Sunday)
const getStartOfWeek = (date: Date): Date => {
	const startOfWeek = new Date(date);
	startOfWeek.setDate(date.getDate() - date.getDay());
	startOfWeek.setHours(0, 0, 0, 0);
	return startOfWeek;
};

// Helper function to get the end of a week (Saturday)
const getEndOfWeek = (startOfWeek: Date): Date => {
	const endOfWeek = new Date(startOfWeek);
	endOfWeek.setDate(startOfWeek.getDate() + 6);
	endOfWeek.setHours(23, 59, 59, 999);
	return endOfWeek;
};

interface MonthlyData {
	revenue: number[];
	expenses: number[];
}

interface SummaryData {
	totalRevenue: number;
	totalExpenses: number;
	profit: number;
}

interface RecentTransaction {
	name: string;
	createdAt: Date;
	amount: number;
}

interface WeeklyTranscriptRequests {
	lastWeek: number[];
	currentWeek: number[];
}

interface TranscriptRequestsData {
	totalRequests: number;
	monthlyRequests: number[];
}

export async function getMonthlyRevenueAndExpenses(
	year: number
): Promise<MonthlyData> {
	const revenue: number[] = [];
	const expenses: number[] = [];

	for (let month = 0; month < 12; month++) {
		const startOfMonth = new Date(year, month, 1);
		const endOfMonth = new Date(year, month + 1, 0);

		const monthRevenue = await Transaction.sum("amount", {
			where: {
				paymentStatus: "paid",
				createdAt: {
					[Op.between]: [startOfMonth, endOfMonth],
				},
			},
		});

		const monthExpenses = 0; // Update this with your expenses logic if you have one

		revenue.push(monthRevenue || 0);
		expenses.push(monthExpenses);
	}

	return { revenue, expenses };
}

export async function getSummary(): Promise<SummaryData> {
	const totalRevenue =
		(await Transaction.sum("amount", {
			where: {
				paymentStatus: "paid",
			},
		})) || 0;

	const totalExpenses = 0; // Update this with your expenses logic if you have one

	const profit = totalRevenue - totalExpenses;

	return { totalRevenue, totalExpenses, profit };
}

export async function getRecentTransactions(
	limit: number = 4
): Promise<RecentTransaction[]> {
	const transactions = await Transaction.findAll({
		limit,
		order: [["createdAt", "DESC"]],
		include: [User],
	});

	return transactions.map((transaction) => ({
		name: transaction.User?.name || "Unknown", // Assuming User model has a name attribute
		createdAt: transaction.createdAt,
		amount: transaction.amount,
	}));
}

export async function getTotalTranscriptRequests(): Promise<TranscriptRequestsData> {
	// Get total number of transcript requests
	const totalRequests = await TranscriptRequest.count();

	// Get monthly transcript requests for the current year
	const monthlyRequests: number[] = [];
	const currentYear = new Date().getFullYear();

	for (let month = 0; month < 12; month++) {
		const startOfMonth = new Date(currentYear, month, 1);
		const endOfMonth = new Date(currentYear, month + 1, 0);

		const monthlyCount = await TranscriptRequest.count({
			where: {
				createdAt: {
					[Op.between]: [startOfMonth, endOfMonth],
				},
			},
		});

		monthlyRequests.push(monthlyCount);
	}

	return { totalRequests, monthlyRequests };
}

export async function getWeeklyTranscriptRequests(): Promise<WeeklyTranscriptRequests> {
	const today = new Date();

	// Calculate the start and end of the current week
	const startOfCurrentWeek = getStartOfWeek(today);
	const endOfCurrentWeek = getEndOfWeek(startOfCurrentWeek);

	// Calculate the start and end of the last week
	const startOfLastWeek = new Date(startOfCurrentWeek);
	startOfLastWeek.setDate(startOfCurrentWeek.getDate() - 7);
	const endOfLastWeek = getEndOfWeek(startOfLastWeek);

	// Fetch requests for the last week
	const lastWeekRequests = await TranscriptRequest.findAll({
		where: {
			createdAt: {
				[Op.between]: [startOfLastWeek, endOfLastWeek],
			},
		},
	});

	// Fetch requests for the current week
	const currentWeekRequests = await TranscriptRequest.findAll({
		where: {
			createdAt: {
				[Op.between]: [startOfCurrentWeek, endOfCurrentWeek],
			},
		},
	});

	// Organize requests by day
	const organizeRequestsByDay = (
		requests: TranscriptRequest[],
		startOfWeek: Date
	): number[] => {
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
}
