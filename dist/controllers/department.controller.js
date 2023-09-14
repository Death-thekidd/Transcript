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
exports.createDepartment = exports.getDepartment = exports.getDepartments = void 0;
const express_validator_1 = require("express-validator");
const department_model_1 = require("../models/department.model");
const college_model_1 = require("../models/college.model");
/**
 * Get all departments
 * @route GET /departments
 */
const getDepartments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departments = yield department_model_1.Department.findAll();
        return res.status(200).json({ data: departments });
    }
    catch (error) {
        next(error);
    }
});
exports.getDepartments = getDepartments;
/**
 * Get department by ID
 * @route GET /department/:id
 */
const getDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departmentId = req.params.id;
        const department = yield department_model_1.Department.findByPk(departmentId);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        return res.status(200).json({ data: department });
    }
    catch (error) {
        next(error);
    }
});
exports.getDepartment = getDepartment;
/**
 * Create new Department
 * @route POST /create-department
 */
const createDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            // Return validation errors as JSON
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, college } = req.body;
        const _college = yield college_model_1.College.findOne({
            where: {
                name: college,
            },
        });
        if (!_college) {
            return res
                .status(404)
                .json({ error: "Department does not have a college" });
        }
        const department = yield department_model_1.Department.create({
            name: name,
            collegeId: _college.id,
        });
        return res
            .status(200)
            .json({ message: "Role created succesfully", data: department });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.createDepartment = createDepartment;
//# sourceMappingURL=department.controller.js.map