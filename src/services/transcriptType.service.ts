// src/services/transcriptTypeService.ts
import TranscriptType from "../database/models/transcripttype";

export const getAllTranscriptTypes = async (): Promise<TranscriptType[]> => {
	return await TranscriptType.findAll();
};

export const getTranscriptTypeById = async (
	id: string
): Promise<TranscriptType | null> => {
	return await TranscriptType.findByPk(id);
};

export const createTranscriptType = async (
	name: string,
	amount: number
): Promise<TranscriptType> => {
	return await TranscriptType.create({ name, amount });
};

export const updateTranscriptType = async (
	id: string,
	updateData: Partial<{ name: string; amount: number }>
): Promise<[number, TranscriptType[]]> => {
	return await TranscriptType.update(updateData, {
		where: { id },
		returning: true,
	});
};

export const deleteTranscriptType = async (
	id: string
): Promise<TranscriptType | null> => {
	const transcriptType = await TranscriptType.findOne({ where: { id } });
	if (transcriptType) {
		await transcriptType.destroy();
		return transcriptType;
	}
	return null;
};
