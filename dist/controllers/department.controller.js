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
exports.deleteDepartment = exports.editDepartment = exports.createDepartment = exports.getDepartment = exports.getDepartments = void 0;
const express_validator_1 = require("express-validator");
const departmentService = __importStar(require("../services/department.service"));
const getDepartments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departments = yield departmentService.getAllDepartments();
        return res.status(200).json({ data: departments });
    }
    catch (error) {
        next(error);
    }
});
exports.getDepartments = getDepartments;
const getDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const department = yield departmentService.getDepartmentById(req.params.id);
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
const createDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, college } = req.body;
        const department = yield departmentService.createDepartment(name, college);
        return res
            .status(201)
            .json({ message: "Department created successfully", data: department });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.createDepartment = createDepartment;
const editDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const department = yield departmentService.updateDepartment(req.params.id, req.body.name);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        return res.status(204).json({ message: "Department updated successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error editing department", error });
    }
});
exports.editDepartment = editDepartment;
const deleteDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield departmentService.deleteDepartment(req.params.id);
        return res.status(204).json({ message: "Department deleted successfully" });
    }
    catch (error) {
        if (error.message === "Department not found") {
            return res.status(404).json({ message: "Department not found" });
        }
        return res.status(500).json({ message: "Error deleting department", error });
    }
});
exports.deleteDepartment = deleteDepartment;
//# sourceMappingURL=department.controller.js.map