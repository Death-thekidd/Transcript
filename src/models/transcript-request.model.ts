import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../sequelize";
import { User } from "./user.model";

export enum TranscriptType {
	LOCAL = "local",
	STAFF = "staff",
}
export interface TranscriptRequestDocument {
	id: string;
	faculty: string;
	department: string;
	transcriptType: TranscriptType;
	deliveryMethod: string;
	destination: string;
	userId: string;
	isPaid: boolean;
	destinationId: string;
}

export interface TranscriptRequestInstance
	extends Model<TranscriptRequestDocument>,
		Document {}

export const initTranscriptRequestModel = (sequelize: Sequelize) => {
	const TranscriptRequest = sequelize.define<TranscriptRequestInstance>(
		"TranscriptRequest",
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				autoIncrement: false,
				primaryKey: true,
			},
			faculty: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			department: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			transcriptType: {
				type: DataTypes.ENUM("local", "international"),
				allowNull: false,
			},
			deliveryMethod: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			destination: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			userId: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			isPaid: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			destinationId: {
				type: DataTypes.UUID,
				allowNull: false,
			},
		}
	);

	return TranscriptRequest;
};

export const TranscriptRequest = initTranscriptRequestModel(sequelize);

export async function init() {
	try {
		await TranscriptRequest.sequelize.sync();
		// console.log("Database and tables synced successfully");
	} catch (error) {
		console.error("Error syncing database:", error);
	}
}
