import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../sequelize";
import { User } from "./user.model";

export interface TranscriptTypeDocument {
	id: string;
	name: string;
	amount: number;
}

export interface TranscriptTypeInstance
	extends Model<TranscriptTypeDocument>,
		TranscriptTypeDocument {}

export const initTranscriptTypeModel = (sequelize: Sequelize) => {
	const TranscriptType = sequelize.define<TranscriptTypeInstance>(
		"TranscriptType",
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				autoIncrement: false,
				primaryKey: true,
			},
			name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
			amount: { type: DataTypes.FLOAT, allowNull: false },
		}
	);

	return TranscriptType;
};

export const TranscriptType = initTranscriptTypeModel(sequelize);

export async function init() {
	try {
		await TranscriptType.sequelize.sync();
		// console.log("Database and tables synced successfully");
	} catch (error) {
		console.error("Error syncing database:", error);
	}
}
