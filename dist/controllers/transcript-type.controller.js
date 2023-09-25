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
exports.deleteTranscriptType = exports.editTranscriptType = exports.createTranscriptType = exports.getTranscriptType = exports.getTranscriptTypes = void 0;
const express_validator_1 = require("express-validator");
const transcript_type_model_1 = require("../models/transcript-type.model");
/**
 * Get all transcript types
 * @route GET /transcript-types
 */
const getTranscriptTypes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transcriptTypes = yield transcript_type_model_1.TranscriptType.findAll();
        return res.status(200).json({ data: transcriptTypes });
    }
    catch (error) {
        next(error);
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
        const transcriptType = yield transcript_type_model_1.TranscriptType.findByPk(transcriptTypeId);
        if (!transcriptType) {
            return res.status(404).json({ message: "Transcipt type not found" });
        }
        return res.status(200).json({ data: transcriptType });
    }
    catch (error) {
        next(error);
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
        const transcriptType = yield transcript_type_model_1.TranscriptType.create({
            name: req.body.name,
            amount: req.body.amount,
        });
        return res.status(200).json({
            message: "Transcipt Type created succesfully",
            data: transcriptType,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error });
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
        const result = yield transcript_type_model_1.TranscriptType.update(Object.assign({}, req.body), { where: { id: id } });
        if (result[0] === 0) {
            return res.status(404).json({ message: "transcript type not found" });
        }
        return res
            .status(204)
            .json({ message: "transcript type updated successfully" });
    }
    catch (error) {
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
        const transcriptType = yield transcript_type_model_1.TranscriptType.findOne({
            where: { id: req.params.id },
        });
        if (transcriptType) {
            // Delete the record
            yield transcriptType.destroy();
            return res
                .status(204)
                .json({ message: "transcript type deleted successfully." });
        }
        else {
            return res.status(404).json({ message: "transcript type not found." });
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Error deleting transcript type", error });
    }
});
exports.deleteTranscriptType = deleteTranscriptType;
//# sourceMappingURL=transcript-type.controller.js.map