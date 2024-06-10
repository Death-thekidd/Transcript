"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_router_1 = __importDefault(require("../routers/auth.router"));
const user_router_1 = __importDefault(require("../routers/user.router"));
const college_router_1 = __importDefault(require("../routers/college.router"));
const department_router_1 = __importDefault(require("../routers/department.router"));
const destination_router_1 = __importDefault(require("../routers/destination.router"));
const paystack_router_1 = __importDefault(require("../routers/paystack.router"));
const privilege_router_1 = __importDefault(require("../routers/privilege.router"));
const role_router_1 = __importDefault(require("../routers/role.router"));
const transaction_router_1 = __importDefault(require("../routers/transaction.router"));
const transcriptRequest_router_1 = __importDefault(require("../routers/transcriptRequest.router"));
const transcriptType_router_1 = __importDefault(require("../routers/transcriptType.router"));
const userDestinationRequest_router_1 = __importDefault(require("../routers/userDestinationRequest.router"));
const wallet_router_1 = __importDefault(require("../routers/wallet.router"));
const walletTransaction_router_1 = __importDefault(require("../routers/walletTransaction.router"));
const adminDashboard_router_1 = __importDefault(require("../routers/adminDashboard.router"));
const router = express_1.Router();
// Authentication Routes
router.use("/auth", auth_router_1.default);
router.use((req, res, next) => {
    // Passport.js isAuthenticated() method checks if a user is authenticated
    if (req.isAuthenticated()) {
        // If authenticated, continue to the next middleware/route
        return next();
    }
    else {
        // If not authenticated, send a JSON response indicating unauthorized access
        return res
            .status(401)
            .json({ message: "Session expired. Please log in again." });
    }
});
// Protected routes
router.use("/user", user_router_1.default);
router.use("/college", college_router_1.default);
router.use("/department", department_router_1.default);
router.use("/destination", destination_router_1.default);
router.use("/paystack", paystack_router_1.default);
router.use("/privilege", privilege_router_1.default);
router.use("/role", role_router_1.default);
router.use("/transaction", transaction_router_1.default);
router.use("/transcript-request", transcriptRequest_router_1.default);
router.use("/transcript-type", transcriptType_router_1.default);
router.use("/user-destination-request", userDestinationRequest_router_1.default);
router.use("/wallet", wallet_router_1.default);
router.use("/wallet-transaction", walletTransaction_router_1.default);
router.use("/admin-dashboard", adminDashboard_router_1.default);
exports.default = router;
//# sourceMappingURL=index.router.js.map