"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../connection"));
class TranscriptRequestDestination extends sequelize_1.Model {
}
TranscriptRequestDestination.init({
    transcriptRequestId: sequelize_1.DataTypes.UUID,
    destinationId: sequelize_1.DataTypes.UUID,
}, {
    sequelize: connection_1.default,
    modelName: "TranscriptRequestDestination",
});
exports.default = TranscriptRequestDestination;
//# sourceMappingURL=transcriptrequestdestination.js.map