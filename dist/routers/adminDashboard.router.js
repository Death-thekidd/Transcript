"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminDashboard_controller_1 = require("../controllers/adminDashboard.controller");
const router = express_1.Router();
router.get("/admin-dashboard", adminDashboard_controller_1.getAdminDashboardData);
exports.default = router;
//# sourceMappingURL=adminDashboard.router.js.map