import { Model, DataTypes, Identifier } from "sequelize";
import connection from "../connection";

interface TranscriptRequestDestinationAttributes {
	id?: Identifier;
	transcriptRequestId?: Identifier;
	destinationId?: Identifier;
	updatedAt?: Date;
	createdAt?: Date;
}

class TranscriptRequestDestination
	extends Model<TranscriptRequestDestinationAttributes>
	implements TranscriptRequestDestinationAttributes
{
	/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
	public id!: Identifier;
	public transcriptRequestId: Identifier;
	public destinationId: Identifier;
	public readonly updatedAt!: Date;
	public readonly createdAt!: Date;
}
TranscriptRequestDestination.init(
	{
		transcriptRequestId: DataTypes.UUID,
		destinationId: DataTypes.UUID,
	},
	{
		sequelize: connection,
		modelName: "TranscriptRequestDestination",
	}
);
export default TranscriptRequestDestination;
