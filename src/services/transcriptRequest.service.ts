// src/services/transcriptRequestService.ts
import TranscriptRequest from "../database/models/transcriptrequest";
import User from "../database/models/user";
import Destination from "../database/models/destination";
import TranscriptType from "../database/models/transcripttype";
import { Identifier } from "sequelize";

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
	const request = await TranscriptRequest.create({
		collegeId: user.collegeId,
		departmentId: user.departmentId,
		matricNo: user.schoolId,
		transcriptTypeId: transcriptType.id,
		status: "pending",
		userId: data.userId,
		total: transcriptType.amount,
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
