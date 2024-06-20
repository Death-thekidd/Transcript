"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../connection"));
const destination_1 = __importDefault(require("./destination"));
const transcripttype_1 = __importDefault(require("./transcripttype"));
const college_1 = __importDefault(require("./college"));
const department_1 = __importDefault(require("./department"));
const user_1 = __importDefault(require("./user"));
class TranscriptRequest extends sequelize_1.Model {
}
TranscriptRequest.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
    },
    collegeId: sequelize_1.DataTypes.UUID,
    departmentId: sequelize_1.DataTypes.UUID,
    transcriptTypeId: sequelize_1.DataTypes.UUID,
    status: {
        type: sequelize_1.DataTypes.ENUM("pending", "accepted"),
        allowNull: false,
    },
    matricNo: sequelize_1.DataTypes.STRING,
    userId: sequelize_1.DataTypes.UUID,
    isPaid: sequelize_1.DataTypes.BOOLEAN,
    total: sequelize_1.DataTypes.FLOAT,
    createdAt: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
    },
    updatedAt: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
    },
}, {
    sequelize: connection_1.default,
    modelName: "TranscriptRequest",
});
TranscriptRequest.belongsToMany(destination_1.default, {
    through: "TranscriptRequestDestinations",
    foreignKey: "transcriptRequestId",
    otherKey: "destinationId",
});
destination_1.default.belongsToMany(TranscriptRequest, {
    through: "TranscriptRequestDestinations",
    foreignKey: "destinationId",
    otherKey: "transcriptRequestId",
});
transcripttype_1.default.hasMany(TranscriptRequest, { foreignKey: "transcriptTypeId" });
TranscriptRequest.belongsTo(transcripttype_1.default, {
    foreignKey: "transcriptTypeId",
});
college_1.default.hasMany(TranscriptRequest, { foreignKey: "collegeId" });
TranscriptRequest.belongsTo(college_1.default, { foreignKey: "collegeId" });
department_1.default.hasMany(TranscriptRequest, { foreignKey: "departmentId" });
TranscriptRequest.belongsTo(department_1.default, { foreignKey: "departmentId" });
user_1.default.hasMany(TranscriptRequest, { foreignKey: "userId" });
TranscriptRequest.belongsTo(user_1.default, { foreignKey: "userId" });
exports.default = TranscriptRequest;
//# sourceMappingURL=transcriptrequest.js.map