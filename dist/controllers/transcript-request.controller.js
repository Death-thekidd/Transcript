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
exports.deleteTranscriptRequest = exports.updateTranscriptRequestStatus = exports.submitTranscriptRequest = exports.getTranscriptRequest = exports.getTranscriptRequests = void 0;
const transcriptRequestService = __importStar(require("../services/transcriptRequest.service"));
const express_validator_1 = require("express-validator");
const getTranscriptRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transcriptRequests = yield transcriptRequestService.getAllTranscriptRequests();
        return res.status(200).json({ data: transcriptRequests });
    }
    catch (error) {
        next(error);
    }
});
exports.getTranscriptRequests = getTranscriptRequests;
const getTranscriptRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transcriptRequestId = req.params.id;
        const transcriptRequest = yield transcriptRequestService.getTranscriptRequestById(transcriptRequestId);
        if (!transcriptRequest) {
            return res.status(404).json({ message: "Transcript Request not found" });
        }
        return res.status(200).json({ data: transcriptRequest });
    }
    catch (error) {
        next(error);
    }
});
exports.getTranscriptRequest = getTranscriptRequest;
const submitTranscriptRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const request = yield transcriptRequestService.createTranscriptRequest(req.body);
        return res.status(201).json({
            message: "Transcript Request created successfully.",
            data: request,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.submitTranscriptRequest = submitTranscriptRequest;
const updateTranscriptRequestStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        yield transcriptRequestService.updateTranscriptRequestStatus(id, status);
        return res
            .status(204)
            .json({ message: "Transcript Request status updated successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.updateTranscriptRequestStatus = updateTranscriptRequestStatus;
const deleteTranscriptRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const success = yield transcriptRequestService.deleteTranscriptRequest(id);
        if (success) {
            return res
                .status(204)
                .json({ message: "Transcript request deleted successfully." });
        }
        else {
            return res.status(404).json({ message: "Transcript request not found." });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.deleteTranscriptRequest = deleteTranscriptRequest;
//# sourceMappingURL=transcript-request.controller.js.map