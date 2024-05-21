"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../connection"));
class UserDestinationRequest extends sequelize_1.Model {
}
UserDestinationRequest.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
    },
    name: sequelize_1.DataTypes.STRING,
    userId: sequelize_1.DataTypes.UUID,
    status: sequelize_1.DataTypes.STRING,
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
    modelName: "UserDestinationRequest",
});
exports.default = UserDestinationRequest;
//# sourceMappingURL=userdestinationrequest.js.map