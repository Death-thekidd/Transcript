import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../sequelize";
import { User } from "./user.model";
import { Destination, DestinationInstance } from "./destination.model";
import {
	TranscriptType,
	TranscriptTypeInstance,
} from "./transcript-type.model";

export interface TranscriptRequestDocument {
	id: string;
	college: string;
	department: string;
	transcriptType: string;
	status: string;
	matricNo: string;
	userId: string;
	isPaid: boolean;
	total: number;
}

export interface TranscriptRequestInstance
	extends Model<TranscriptRequestDocument>,
		TranscriptRequestDocument {
	addDestination: (destination: DestinationInstance) => Promise<void>;
	getDestinations: () => Promise<DestinationInstance[]>;
	getTranscriptType: () => Promise<TranscriptTypeInstance>;
	setTranscriptType: (transcriptType: TranscriptTypeInstance) => Promise<void>;
}

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
			matricNo: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			college: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			department: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			transcriptType: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			status: {
				type: DataTypes.ENUM("pending", "accepted"),
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
			total: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
		}
	);

	return TranscriptRequest;
};

export const TranscriptRequest = initTranscriptRequestModel(sequelize);

TranscriptRequest.belongsToMany(Destination, {
	through: "TranscriptRequestDestination",
});

Destination.belongsToMany(TranscriptRequest, {
	through: "TranscriptRequestDestination",
});

TranscriptRequest.hasOne(TranscriptType, {});
TranscriptType.belongsTo(TranscriptRequest, {});

export async function init() {
	try {
		await TranscriptRequest.sequelize.sync();
		// console.log("Database and tables synced successfully");
	} catch (error) {
		console.error("Error syncing database:", error);
	}
}
