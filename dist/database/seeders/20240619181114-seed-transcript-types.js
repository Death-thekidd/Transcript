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
const transcriptType_service_1 = require("../../services/transcriptType.service");
const connection_1 = __importDefault(require("../connection"));
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * Add seed commands here.
             *
             * Example:
             * await queryInterface.bulkInsert('People', [{
             *   name: 'John Doe',
             *   isBetaMember: false
             * }], {});
             */
            yield connection_1.default.sync();
            const transcriptTypesToSeed = [
                {
                    name: "Local",
                    amount: 2000,
                },
                {
                    name: "International",
                    amount: 5000,
                },
            ];
            for (const { name, amount } of transcriptTypesToSeed) {
                // Create the transcript type
                yield transcriptType_service_1.createTranscriptType(name, amount);
            }
            console.log("Transcript Type seeding completed.");
        });
    },
    down(queryInterface) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * Add commands to revert seed here.
             *
             * Example:
             * await queryInterface.bulkDelete('People', null, {});
             */
            yield queryInterface.bulkDelete("TranscriptTypes", null, {});
        });
    },
};
//# sourceMappingURL=20240619181114-seed-transcript-types.js.map