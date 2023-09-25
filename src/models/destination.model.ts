import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../sequelize";
import { User } from "./user.model";

export interface DestinationDocument {
	id: string;
	name: string;
	deliveryMethod: string;
	rate: number;
}

export interface DestinationInstance
	extends Model<DestinationDocument>,
		DestinationDocument {}

export const initDestinationModel = (sequelize: Sequelize) => {
	const Destination = sequelize.define<DestinationInstance>("Destination", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
		},
		name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
		deliveryMethod: { type: DataTypes.STRING(50) },
		rate: { type: DataTypes.FLOAT },
	});

	return Destination;
};

export const Destination = initDestinationModel(sequelize);

export async function init() {
	try {
		await Destination.sequelize.sync();
		// console.log("Database and tables synced successfully");
	} catch (error) {
		console.error("Error syncing database:", error);
	}
}
