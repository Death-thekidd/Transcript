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
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/transcriptRequestRoutes.ts
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const transcriptRequestController = __importStar(require("../controllers/transcript-request.controller"));
const router = express_1.Router();
router.get("/transcript-requests", transcriptRequestController.getTranscriptRequests);
router.get("/recent-transcript-requests/:id", transcriptRequestController.getRecentTranscriptRequests);
router.get("/transcript-request/:id", express_validator_1.param("id").isString().withMessage("Transcript request ID must be a string"), transcriptRequestController.getTranscriptRequest);
router.post("/submit-request", express_validator_1.body("userId").isString().withMessage("User ID must be a string"), express_validator_1.body("transcriptType")
    .isString()
    .withMessage("Transcript type must be a string"), express_validator_1.body("destinations").isArray().withMessage("Destinations must be an array"), transcriptRequestController.submitTranscriptRequest);
router.patch("/update-transcript-request-status/:id", express_validator_1.param("id").isString().withMessage("Transcript request ID must be a string"), express_validator_1.body("status").isString().withMessage("Status must be a string"), transcriptRequestController.updateTranscriptRequestStatus);
router.delete("/delete-transcript-request/:id", express_validator_1.param("id").isString().withMessage("Transcript request ID must be a string"), transcriptRequestController.deleteTranscriptRequest);
exports.default = router;
//# sourceMappingURL=transcriptRequest.router.js.map