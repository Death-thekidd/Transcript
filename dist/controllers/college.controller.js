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
exports.deleteCollege = exports.editCollege = exports.createCollege = exports.getCollege = exports.getColleges = void 0;
const express_validator_1 = require("express-validator");
const collegeService = __importStar(require("../services/college.service"));
const getColleges = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const colleges = yield collegeService.getAllColleges();
        return res.status(200).json({ data: colleges });
    }
    catch (error) {
        next(error);
    }
});
exports.getColleges = getColleges;
const getCollege = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const college = yield collegeService.getCollegeById(req.params.id);
        if (!college) {
            return res.status(404).json({ message: "College not found" });
        }
        return res.status(200).json({ data: college });
    }
    catch (error) {
        next(error);
    }
});
exports.getCollege = getCollege;
const createCollege = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const college = yield collegeService.createCollege(req.body.name);
        return res
            .status(200)
            .json({ message: "College created successfully", data: college });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.createCollege = createCollege;
const editCollege = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield collegeService.updateCollege(req.params.id, req.body.name);
        return res.status(204).json({ message: "College updated successfully" });
    }
    catch (error) {
        if (error.message === "College not found") {
            return res.status(404).json({ message: "College not found" });
        }
        return res.status(500).json({ message: "Error editing college", error });
    }
});
exports.editCollege = editCollege;
const deleteCollege = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield collegeService.deleteCollege(req.params.id);
        return res.status(204).json({ message: "College deleted successfully" });
    }
    catch (error) {
        if (error.message === "College not found") {
            return res.status(404).json({ message: "College not found" });
        }
        return res.status(500).json({ message: "Error deleting college", error });
    }
});
exports.deleteCollege = deleteCollege;
//# sourceMappingURL=college.controller.js.map