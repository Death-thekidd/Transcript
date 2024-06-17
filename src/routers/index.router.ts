import { Router } from "express";

import authRoutes from "../routers/auth.router";
import userRoutes from "../routers/user.router";
import collegeRoutes from "../routers/college.router";
import departmentRoutes from "../routers/department.router";
import destinationRoutes from "../routers/destination.router";
import paystackRoutes from "../routers/paystack.router";
import privilegeRoutes from "../routers/privilege.router";
import roleRoutes from "../routers/role.router";
import transactionRoutes from "../routers/transaction.router";
import transcriptRequestRoutes from "../routers/transcriptRequest.router";
import transcriptTypeRoutes from "../routers/transcriptType.router";
import userDestinationRequestRoutes from "../routers/userDestinationRequest.router";
import walletRoutes from "../routers/wallet.router";
import walletTransactionRoutes from "../routers/walletTransaction.router";
import adminDashboardRoutes from "../routers/adminDashboard.router";

const router = Router();

// Authentication Routes
router.use("/auth", authRoutes);
router.use("/paystack", paystackRoutes);

router.use((req, res, next) => {
	// Passport.js isAuthenticated() method checks if a user is authenticated
	if (req.isAuthenticated()) {
		// If authenticated, continue to the next middleware/route
		return next();
	} else {
		// If not authenticated, send a JSON response indicating unauthorized access
		return res
			.status(401)
			.json({ message: "Session expired. Please log in again." });
	}
});

// Protected routes
router.use("/user", userRoutes);
router.use("/college", collegeRoutes);
router.use("/department", departmentRoutes);
router.use("/destination", destinationRoutes);
router.use("/privilege", privilegeRoutes);
router.use("/role", roleRoutes);
router.use("/transaction", transactionRoutes);
router.use("/transcript-request", transcriptRequestRoutes);
router.use("/transcript-type", transcriptTypeRoutes);
router.use("/user-destination-request", userDestinationRequestRoutes);
router.use("/wallet", walletRoutes);
router.use("/wallet-transaction", walletTransactionRoutes);
router.use("/admin-dashboard", adminDashboardRoutes);

export default router;
