"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteTranscriptType = exports.editTranscriptType = exports.createTranscriptType = exports.getTranscriptType = exports.getTranscriptTypes = void 0;
const express_validator_1 = require("express-validator");
const transcriptTypeService = __importStar(require("../services/transcriptType.service"));
/**
 * Get all transcript types
 * @route GET /transcript-types
 */
const getTranscriptTypes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transcriptTypes = yield transcriptTypeService.getAllTranscriptTypes();
        return res.status(200).json({ data: transcriptTypes });
    }
    catch (error) {
        next(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getTranscriptTypes = getTranscriptTypes;
/**
 * Get transcript type by ID
 * @route GET /transcript-type/:id
 */
const getTranscriptType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transcriptTypeId = req.params.id;
        const transcriptType = yield transcriptTypeService.getTranscriptTypeById(transcriptTypeId);
        if (!transcriptType) {
            return res.status(404).json({ message: "Transcript type not found" });
        }
        return res.status(200).json({ data: transcriptType });
    }
    catch (error) {
        next(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getTranscriptType = getTranscriptType;
/**
 * Create new Transcript Type
 * @route POST /create-transcript-type
 */
const createTranscriptType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            // Return validation errors as JSON
            return res.status(400).json({ errors: errors.array() });
        }
        const transcriptType = yield transcriptTypeService.createTranscriptType(req.body.name, req.body.amount);
        return res.status(201).json({
            message: "Transcript Type created successfully",
            data: transcriptType,
        });
    }
    catch (error) {
        next(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createTranscriptType = createTranscriptType;
/**
 * Edit existing transcript type
 * @route PATCH /edit-transcript-type/:id
 */
const editTranscriptType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const result = yield transcriptTypeService.updateTranscriptType(id, req.body);
        if (result[0] === 0) {
            return res.status(404).json({ message: "Transcript type not found" });
        }
        return res
            .status(200)
            .json({ message: "Transcript type updated successfully" });
    }
    catch (error) {
        next(error);
        return res
            .status(500)
            .json({ message: "Error editing transcript type", error });
    }
});
exports.editTranscriptType = editTranscriptType;
/**
 * Delete transcript type
 * @route DELETE /delete-transcript-type/:id
 */
const deleteTranscriptType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transcriptType = yield transcriptTypeService.deleteTranscriptType(req.params.id);
        if (transcriptType) {
            return res
                .status(200)
                .json({ message: "Transcript type deleted successfully." });
        }
        else {
            return res.status(404).json({ message: "Transcript type not found." });
        }
    }
    catch (error) {
        next(error);
        return res
            .status(500)
            .json({ message: "Error deleting transcript type", error });
    }
});
exports.deleteTranscriptType = deleteTranscriptType;
//# sourceMappingURL=transcript-type.controller.js.map