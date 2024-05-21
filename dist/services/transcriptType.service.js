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
exports.deleteTranscriptType = exports.updateTranscriptType = exports.createTranscriptType = exports.getTranscriptTypeById = exports.getAllTranscriptTypes = void 0;
// src/services/transcriptTypeService.ts
const transcripttype_1 = __importDefault(require("../database/models/transcripttype"));
const getAllTranscriptTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield transcripttype_1.default.findAll();
});
exports.getAllTranscriptTypes = getAllTranscriptTypes;
const getTranscriptTypeById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield transcripttype_1.default.findByPk(id);
});
exports.getTranscriptTypeById = getTranscriptTypeById;
const createTranscriptType = (name, amount) => __awaiter(void 0, void 0, void 0, function* () {
    return yield transcripttype_1.default.create({ name, amount });
});
exports.createTranscriptType = createTranscriptType;
const updateTranscriptType = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield transcripttype_1.default.update(updateData, {
        where: { id },
        returning: true,
    });
});
exports.updateTranscriptType = updateTranscriptType;
const deleteTranscriptType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const transcriptType = yield transcripttype_1.default.findOne({ where: { id } });
    if (transcriptType) {
        yield transcriptType.destroy();
        return transcriptType;
    }
    return null;
});
exports.deleteTranscriptType = deleteTranscriptType;
//# sourceMappingURL=transcriptType.service.js.map