// routes/paymentRoutes.ts
import express from "express";
import {
	initializePayment,
	verifyPayment,
} from "../controllers/paystack.controller";

const router = express.Router();

router.post("/initialize-payment", initializePayment);
router.post("/verify-transaction", verifyPayment);

export default router;
