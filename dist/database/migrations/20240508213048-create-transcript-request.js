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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.createTable("TranscriptRequests", {
                id: {
                    allowNull: false,
                    autoIncrement: false,
                    primaryKey: true,
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                },
                collegeId: {
                    type: Sequelize.UUID,
                },
                departmentId: {
                    type: Sequelize.UUID,
                },
                transcriptTypeId: {
                    type: Sequelize.UUID,
                },
                status: {
                    type: sequelize_1.DataTypes.ENUM("pending", "accepted"),
                    allowNull: false,
                },
                matricNo: {
                    type: Sequelize.STRING,
                },
                userId: {
                    type: Sequelize.UUID,
                },
                isPaid: {
                    type: Sequelize.BOOLEAN,
                },
                total: {
                    type: Sequelize.FLOAT,
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
            });
        });
    },
    down(queryInterface) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.dropTable("TranscriptRequests");
        });
    },
};
//# sourceMappingURL=20240508213048-create-transcript-request.js.map