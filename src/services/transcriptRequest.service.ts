import TranscriptRequest from "../database/models/transcriptrequest";
import User from "../database/models/user";
import Destination from "../database/models/destination";
import TranscriptType from "../database/models/transcripttype";
import { Identifier } from "sequelize";

interface RecentRequest {
	type: string;
	matricNo: string;
	fee: number;
	status: string;
	createdAt: Date;
}

const PAYSTACK_TRANSACTION_PERCENTAGE = 0.015; // Paystack charges 1.5%
const PAYSTACK_TRANSACTION_CAP = 2000; // The maximum Paystack transaction fee is ₦2000
const PAYSTACK_ADDITIONAL_CHARGE = 100; // An additional ₦100 charge for international transactions (if applicable)

export async function getAllTranscriptRequests(): Promise<TranscriptRequest[]> {
	return await TranscriptRequest.findAll({
		include: [Destination, TranscriptType],
	});
}

export async function getTranscriptRequestById(
	id: string
): Promise<TranscriptRequest | null> {
	return await TranscriptRequest.findByPk(id, {
		include: [Destination, TranscriptType],
	});
}

export async function createTranscriptRequest(data: {
	userId: Identifier;
	transcriptType: string;
	destinations: Identifier[];
}): Promise<TranscriptRequest> {
	const user = await User.findByPk(data.userId, {
		include: [TranscriptType],
	});
	if (!user) {
		throw new Error("User not found.");
	}

	const transcriptType = await TranscriptType.findOne({
		where: { name: data.transcriptType },
	});
	if (!transcriptType) {
		throw new Error("Transcript type not found.");
	}

	// Calculate the total amount
	let totalAmount = transcriptType.amount;

	for (const destinationId of data.destinations) {
		const destination = await Destination.findByPk(destinationId);
		if (destination) {
			totalAmount += destination.rate;
		} else {
			throw new Error(`Destination with id ${destinationId} not found.`);
		}
	}

	// Calculate Paystack transaction fee
	let transactionFee = totalAmount * PAYSTACK_TRANSACTION_PERCENTAGE;
	if (transactionFee > PAYSTACK_TRANSACTION_CAP) {
		transactionFee = PAYSTACK_TRANSACTION_CAP;
	}
	// if (/* condition to check if it is an international transaction */) {
	// 	transactionFee += PAYSTACK_ADDITIONAL_CHARGE;
	// }

	const total = totalAmount + transactionFee;

	const request = await TranscriptRequest.create({
		collegeId: user.collegeId,
		departmentId: user.departmentId,
		matricNo: user.schoolId,
		transcriptTypeId: transcriptType.id,
		status: "pending",
		userId: data.userId,
		total,
	});

	for (const destinationId of data.destinations) {
		const destination = await Destination.findByPk(destinationId);
		await request.addDestination(destination);
	}

	return request;
}

export async function updateTranscriptRequestStatus(
	id: string,
	status: string
): Promise<void> {
	await TranscriptRequest.update({ status }, { where: { id } });
}

export async function deleteTranscriptRequest(id: string): Promise<boolean> {
	const transcriptRequest = await TranscriptRequest.findByPk(id);
	if (transcriptRequest) {
		await transcriptRequest.destroy();
		return true;
	}
	return false;
}

export async function getRecentTranscriptRequests(
	limit: number = 4,
	id: Identifier
): Promise<RecentRequest[]> {
	const transcriptRequests = await TranscriptRequest.findAll({
		limit,
		order: [["createdAt", "DESC"]],
		where: { userId: id },
		include: [User, TranscriptType],
	});

	const requests = await Promise.all(
		transcriptRequests.map(async (request) => ({
			type: (await request.getTranscriptType()).name || "Unknown", // Assuming User model has a name attribute
			createdAt: request.createdAt,
			fee: request.total,
			status: request.status,
			matricNo: request.matricNo,
		}))
	);

	return requests;
}
