// src/routes/authRoutes.ts
import { Router } from "express";
import * as authController from "../controllers/auth.controller";

const router = Router();

router.post("/login", authController.postLogin);
router.post("/logout", authController.logout);
router.post("/signup", authController.postSignup);
router.post("/reset/:token", authController.postReset);
router.post("/forgot", authController.postForgot);

export default router;
