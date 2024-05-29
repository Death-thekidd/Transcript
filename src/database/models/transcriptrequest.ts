import { Model, DataTypes, Identifier } from "sequelize";
import connection from "../connection";
import Destination, { DestinationAttributes } from "./destination";
import TranscriptType, { TranscriptTypeAttributes } from "./transcripttype";
import College from "./college";
import Department from "./department";
import User from "./user";

export interface TranscriptRequestAttributes {
	id?: Identifier;
	collegeId?: Identifier;
	departmentId?: Identifier;
	transcriptTypeId?: Identifier;
	status: string;
	matricNo: string;
	userId: Identifier;
	isPaid: boolean;
	total: number;
	updatedAt?: Date;
	createdAt?: Date;
}

class TranscriptRequest
	extends Model<TranscriptRequestAttributes>
	implements TranscriptRequestAttributes
{
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	public id!: Identifier;
	public collegeId!: Identifier;
	public departmentId!: Identifier;
	public transcriptTypeId!: Identifier;
	public status: string;
	public matricNo: string;
	public userId: Identifier;
	public isPaid: boolean;
	public total: number;
	public readonly updatedAt!: Date;
	public readonly createdAt!: Date;
	addDestination: (destination: DestinationAttributes) => Promise<void>;
	getDestinations: () => Promise<DestinationAttributes[]>;
	getTranscriptType: () => Promise<TranscriptTypeAttributes>;
	setTranscriptType: (transcriptType: TranscriptTypeAttributes) => Promise<void>;
}
TranscriptRequest.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
		},
		collegeId: DataTypes.UUID,
		departmentId: DataTypes.UUID,
		transcriptTypeId: DataTypes.UUID,
		status: {
			type: DataTypes.ENUM("pending", "accepted"),
			allowNull: false,
		},
		matricNo: DataTypes.STRING,
		userId: DataTypes.UUID,
		isPaid: DataTypes.BOOLEAN,
		total: DataTypes.FLOAT,
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE,
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE,
		},
	},
	{
		sequelize: connection,
		modelName: "TranscriptRequest",
	}
);

TranscriptRequest.belongsToMany(Destination, {
	through: "TranscriptRequestDestinations",
});

Destination.belongsToMany(TranscriptRequest, {
	through: "TranscriptRequestDestinations",
});

TranscriptType.hasMany(TranscriptRequest, { foreignKey: "transcriptTypeId" });
TranscriptRequest.belongsTo(TranscriptType, {
	foreignKey: "transcriptTypeId",
});

College.hasMany(TranscriptRequest, { foreignKey: "collegeId" });
TranscriptRequest.belongsTo(College, { foreignKey: "collegeId" });

Department.hasMany(TranscriptRequest, { foreignKey: "departmentId" });
TranscriptRequest.belongsTo(Department, { foreignKey: "departmentId" });

User.hasMany(TranscriptRequest, { foreignKey: "userId" });
TranscriptRequest.belongsTo(User, { foreignKey: "userId" });

export default TranscriptRequest;
