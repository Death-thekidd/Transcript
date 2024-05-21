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
exports.deleteCollege = exports.updateCollege = exports.createCollege = exports.getCollegeById = exports.getAllColleges = void 0;
const college_1 = __importDefault(require("../database/models/college"));
const department_1 = __importDefault(require("../database/models/department"));
const getAllColleges = () => __awaiter(void 0, void 0, void 0, function* () {
    const colleges = yield college_1.default.findAll({
        include: department_1.default,
    });
    return colleges.map((college) => {
        const departments = college.Departments
            ? college.Departments.map((department) => department.name)
            : [];
        return {
            id: college.id,
            name: college.name,
            departments,
        };
    });
});
exports.getAllColleges = getAllColleges;
const getCollegeById = (collegeId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield college_1.default.findByPk(collegeId);
});
exports.getCollegeById = getCollegeById;
const createCollege = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return yield college_1.default.create({ name });
});
exports.createCollege = createCollege;
const updateCollege = (id, name) => __awaiter(void 0, void 0, void 0, function* () {
    const college = yield college_1.default.findOne({ where: { id } });
    if (college) {
        college.name = name;
        return yield college.save();
    }
    else {
        throw new Error("College not found");
    }
});
exports.updateCollege = updateCollege;
const deleteCollege = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const college = yield college_1.default.findOne({ where: { id } });
    if (college) {
        yield college.destroy();
    }
    else {
        throw new Error("College not found");
    }
});
exports.deleteCollege = deleteCollege;
//# sourceMappingURL=college.service.js.map