"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/collegeRoutes.ts
const express_1 = __importDefault(require("express"));
const college_controller_1 = require("../controllers/college.controller");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.get("/colleges", college_controller_1.getColleges);
router.get("/college/:id", college_controller_1.getCollege);
router.post("/create-college", [express_validator_1.body("name").notEmpty().withMessage("Name is required")], college_controller_1.createCollege);
router.patch("/edit-college/:id", college_controller_1.editCollege);
router.delete("/delete-college/:id", college_controller_1.deleteCollege);
exports.default = router;
//# sourceMappingURL=college.router.js.map