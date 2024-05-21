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
// src/routes/transcriptTypeRoutes.ts
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const transcriptTypeController = __importStar(require("../controllers/transcript-type.controller"));
const router = express_1.Router();
router.get("/transcript-types", transcriptTypeController.getTranscriptTypes);
router.get("/transcript-type/:id", express_validator_1.param("id").isString().withMessage("Transcript type ID must be a string"), transcriptTypeController.getTranscriptType);
router.post("/create-transcript-type", express_validator_1.body("name").isString().withMessage("Name must be a string"), express_validator_1.body("amount").isNumeric().withMessage("Amount must be a number"), transcriptTypeController.createTranscriptType);
router.patch("/edit-transcript-type/:id", express_validator_1.param("id").isString().withMessage("Transcript type ID must be a string"), transcriptTypeController.editTranscriptType);
router.delete("/delete-transcript-type/:id", express_validator_1.param("id").isString().withMessage("Transcript type ID must be a string"), transcriptTypeController.deleteTranscriptType);
exports.default = router;
//# sourceMappingURL=transcriptType.router.js.map