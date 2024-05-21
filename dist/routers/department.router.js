"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/departmentRoutes.ts
const express_1 = __importDefault(require("express"));
const department_controller_1 = require("../controllers/department.controller");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.get("/departments", department_controller_1.getDepartments);
router.get("/department/:id", department_controller_1.getDepartment);
router.post("/create-department", [
    express_validator_1.body("name").notEmpty().withMessage("Name is required"),
    express_validator_1.body("college").notEmpty().withMessage("College is required"),
], department_controller_1.createDepartment);
router.patch("/edit-department/:id", department_controller_1.editDepartment);
router.delete("/delete-department/:id", department_controller_1.deleteDepartment);
exports.default = router;
//# sourceMappingURL=department.router.js.map