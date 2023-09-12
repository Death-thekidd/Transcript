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
exports.init = exports.TranscriptRequest = exports.initTranscriptRequestModel = exports.TranscriptType = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
var TranscriptType;
(function (TranscriptType) {
    TranscriptType["LOCAL"] = "local";
    TranscriptType["STAFF"] = "staff";
})(TranscriptType = exports.TranscriptType || (exports.TranscriptType = {}));
const initTranscriptRequestModel = (sequelize) => {
    const TranscriptRequest = sequelize.define("TranscriptRequest", {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
        },
        faculty: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        department: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        transcriptType: {
            type: sequelize_1.DataTypes.ENUM("local", "international"),
            allowNull: false,
        },
        deliveryMethod: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        destination: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        isPaid: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        destinationId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        rate: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
        },
        transcriptFee: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
        },
        total: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
        }
    });
    return TranscriptRequest;
};
exports.initTranscriptRequestModel = initTranscriptRequestModel;
exports.TranscriptRequest = exports.initTranscriptRequestModel(sequelize_2.default);
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.TranscriptRequest.sequelize.sync();
            // console.log("Database and tables synced successfully");
        }
        catch (error) {
            console.error("Error syncing database:", error);
        }
    });
}
exports.init = init;
//# sourceMappingURL=transcript-request.model.js.map