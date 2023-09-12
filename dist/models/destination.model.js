"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.Destination = exports.initDestinationModel = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
const initDestinationModel = (sequelize) => {
    const Destination = sequelize.define("Destination", {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
        },
        name: { type: sequelize_1.DataTypes.STRING(50), allowNull: false, unique: true },
        deliveryMethod: { type: sequelize_1.DataTypes.STRING(50), allowNull: false },
        rate: { type: sequelize_1.DataTypes.FLOAT, allowNull: false },
    });
    return Destination;
};
exports.initDestinationModel = initDestinationModel;
exports.Destination = exports.initDestinationModel(sequelize_2.default);
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.Destination.sequelize.sync();
            // console.log("Database and tables synced successfully");
        }
        catch (error) {
            console.error("Error syncing database:", error);
        }
    });
}
exports.init = init;
//# sourceMappingURL=destination.model.js.map