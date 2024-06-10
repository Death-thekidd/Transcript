import { Router } from "express";
import { getAdminDashboardData } from "../controllers/adminDashboard.controller";

const router = Router();

router.get("/admin-dashboard", getAdminDashboardData);

export default router;
