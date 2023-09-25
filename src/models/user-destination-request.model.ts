import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../sequelize";
import { User } from "./user.model";

export interface UserDestinationRequestDocument {
	id: string;
	name: string;
	userId: string;
	status: string;
}

export interface UserDestinationRequestInstance
	extends Model<UserDestinationRequestDocument>,
		UserDestinationRequestDocument {}

export const initUserDestinationRequestModel = (sequelize: Sequelize) => {
	const UserDestinationRequest =
		sequelize.define<UserDestinationRequestInstance>("UserDestinationRequest", {
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				autoIncrement: false,
				primaryKey: true,
			},
			name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
			userId: { type: DataTypes.UUID, allowNull: false },
			status: { type: DataTypes.ENUM("pending", "accepted") },
		});

	return UserDestinationRequest;
};

export const UserDestinationRequest =
	initUserDestinationRequestModel(sequelize);

export async function init() {
	try {
		await UserDestinationRequest.sequelize.sync();
		// console.log("Database and tables synced successfully");
	} catch (error) {
		console.error("Error syncing database:", error);
	}
}
