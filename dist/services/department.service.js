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
exports.deleteDepartment = exports.updateDepartment = exports.createDepartment = exports.getDepartmentById = exports.getAllDepartments = void 0;
// services/departmentService.ts
const department_1 = __importDefault(require("../database/models/department"));
const college_1 = __importDefault(require("../database/models/college"));
const getAllDepartments = () => __awaiter(void 0, void 0, void 0, function* () {
    const departments = yield department_1.default.findAll();
    const departmentsWithCollegeNames = yield Promise.all(departments.map((department) => __awaiter(void 0, void 0, void 0, function* () {
        const college = yield college_1.default.findByPk(department.collegeId);
        return Object.assign(Object.assign({}, department.dataValues), { collegeName: college === null || college === void 0 ? void 0 : college.name });
    })));
    return departmentsWithCollegeNames;
});
exports.getAllDepartments = getAllDepartments;
const getDepartmentById = (departmentId) => __awaiter(void 0, void 0, void 0, function* () {
    const department = yield department_1.default.findByPk(departmentId);
    if (!department) {
        return null;
    }
    const college = yield college_1.default.findByPk(department.collegeId);
    return Object.assign(Object.assign({}, department.dataValues), { collegeName: college === null || college === void 0 ? void 0 : college.name });
});
exports.getDepartmentById = getDepartmentById;
const createDepartment = (name, collegeName) => __awaiter(void 0, void 0, void 0, function* () {
    const college = yield college_1.default.findOne({ where: { name: collegeName } });
    if (!college) {
        throw new Error("College not found");
    }
    return yield department_1.default.create({ name, collegeId: college.id });
});
exports.createDepartment = createDepartment;
const updateDepartment = (id, name) => __awaiter(void 0, void 0, void 0, function* () {
    const department = yield department_1.default.findOne({ where: { id } });
    if (!department) {
        return null;
    }
    department.name = name;
    yield department.save();
    return department;
});
exports.updateDepartment = updateDepartment;
const deleteDepartment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const department = yield department_1.default.findOne({ where: { id } });
    if (department) {
        yield department.destroy();
    }
    else {
        throw new Error("Department not found");
    }
});
exports.deleteDepartment = deleteDepartment;
//# sourceMappingURL=department.service.js.map