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
exports.deleteDepartment = exports.editDepartment = exports.createDepartment = exports.getDepartment = exports.getDepartments = void 0;
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
        const departmentsNew = departments.map((department) => __awaiter(void 0, void 0, void 0, function* () {
            const college = yield college_model_1.College.findByPk(department === null || department === void 0 ? void 0 : department.collegeId);
            return Object.assign(Object.assign({}, department === null || department === void 0 ? void 0 : department.dataValues), { collegeName: college === null || college === void 0 ? void 0 : college.name });
        }));
        const departmentsConsumed = yield Promise.all(departmentsNew);
        return res.status(200).json({ data: departmentsConsumed });
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
        const college = yield college_model_1.College.findByPk(department.collegeId);
        return res
            .status(200)
            .json({ data: Object.assign(Object.assign({}, department.dataValues), { collegeName: college.name }) });
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
            .status(201)
            .json({ message: "Deapartment created succesfully", data: department });
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.createDepartment = createDepartment;
/**
 * Edit existing department
 * @route PATCH /edit-department/:id
 */
const editDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { name } = req.body;
    try {
        const department = yield department_model_1.Department.findOne({ where: { id: id } });
        if (department) {
            // Update the record with new values
            department.name = name;
            // You can update multiple fields here
            // Save the changes to the database
            yield department.save();
            return res
                .status(204)
                .json({ message: "Department updated successfully" });
        }
        else {
            return res.status(404).json({ message: "Department not found" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Error editing department", error });
    }
});
exports.editDepartment = editDepartment;
/**
 * Delete department
 * @route DELETE /delete-department/:id
 */
const deleteDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const department = yield department_model_1.Department.findOne({
            where: { id: req.params.id },
        });
        if (department) {
            // Delete the record
            yield department.destroy();
            return res
                .status(204)
                .json({ message: "Department deleted successfully." });
        }
        else {
            return res.status(404).json({ message: "Department not found." });
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Error deleting department", error });
    }
});
exports.deleteDepartment = deleteDepartment;
//# sourceMappingURL=department.controller.js.map