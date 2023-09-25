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
exports.submitTranscriptRequest = exports.getTranscriptRequest = exports.getTranscriptRequests = void 0;
const transcript_request_model_1 = require("../models/transcript-request.model");
const user_model_1 = require("../models/user.model");
const express_validator_1 = require("express-validator");
const async_1 = __importDefault(require("async"));
const destination_model_1 = require("../models/destination.model");
const transcript_type_model_1 = require("../models/transcript-type.model");
/**
 * Get all transcript requests
 * @route GET /transcript-requests
 */
const getTranscriptRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transcriptRequests = yield transcript_request_model_1.TranscriptRequest.findAll();
        return res.status(200).json({ data: transcriptRequests });
    }
    catch (error) {
        next(error);
    }
});
exports.getTranscriptRequests = getTranscriptRequests;
/**
 * Get transcript request by ID
 * @route GET /transcript-request/:id
 */
const getTranscriptRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transcriptRequestId = req.params.id;
        const transcriptRequest = yield transcript_request_model_1.TranscriptRequest.findByPk(transcriptRequestId);
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
/**
 * Create Transcript request
 * @route POST /submit-request
 */
const submitTranscriptRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            // Return validation errors as JSON
            return res.status(400).json({ errors: errors.array() });
        }
        async_1.default.waterfall([
            function checkUser(done) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield user_model_1.User.findByPk(req.body.userId);
                    if (!user) {
                        return done(new Error("User not found."), null); // Pass an error to the next function
                    }
                    done(undefined, user);
                });
            },
            function saveRequest(user, done) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const { transcriptType, userId, destinations } = req.body;
                        const _transcriptType = yield transcript_type_model_1.TranscriptType.findOne({
                            where: {
                                name: transcriptType,
                            },
                        });
                        const request = yield transcript_request_model_1.TranscriptRequest.create({
                            college: user.college,
                            department: user.department,
                            matricNo: user.schoolId,
                            transcriptType: transcriptType,
                            status: "pending",
                            userId: userId,
                        });
                        const transcriptRequest = yield transcript_request_model_1.TranscriptRequest.findByPk(request.id, {
                            include: destination_model_1.Destination,
                        });
                        for (const { name, deliveryMethod } of destinations) {
                            const destination = yield destination_model_1.Destination.findOne({
                                where: { name: name, deliveryMethod: deliveryMethod },
                            });
                            yield transcriptRequest.addDestination(destination);
                        }
                        transcriptRequest.addTranscriptType(_transcriptType);
                        done(null, request, user);
                    }
                    catch (error) {
                        console.error("Unable to create Leave request : ", error);
                        return done(error, null, null); // Pass an error to the next function
                    }
                });
            },
        ], (err, request) => {
            if (err) {
                return next(err); // Handle errors at the end of the waterfall
            }
            return res.status(201).json({
                message: "Trannscript Request created successfully.",
                data: request,
            });
        });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.submitTranscriptRequest = submitTranscriptRequest;
//# sourceMappingURL=transcript-request.controller.js.map