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
exports.createCollege = exports.getCollege = exports.getColleges = void 0;
const express_validator_1 = require("express-validator");
const college_model_1 = require("../models/college.model");
/**
 * Get all college
 * @route GET /colleges
 */
const getColleges = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const colleges = yield college_model_1.College.findAll();
        return res.status(200).json({ data: colleges });
    }
    catch (error) {
        next(error);
    }
});
exports.getColleges = getColleges;
/**
 * Get college by ID
 * @route GET /college/:id
 */
const getCollege = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collegeId = req.params.id;
        const college = yield college_model_1.College.findByPk(collegeId);
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
/**
 * Create new College
 * @route POST /create-college
 */
const createCollege = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            // Return validation errors as JSON
            return res.status(400).json({ errors: errors.array() });
        }
        const college = yield college_model_1.College.create({
            name: req.body.name,
        });
        return res
            .status(200)
            .json({ message: "College created succesfully", data: college });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.createCollege = createCollege;
//# sourceMappingURL=college.controller.js.map