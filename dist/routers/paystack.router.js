"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/paymentRoutes.ts
const express_1 = __importDefault(require("express"));
const paystack_controller_1 = require("../controllers/paystack.controller");
const router = express_1.default.Router();
router.post("/initialize-payment", paystack_controller_1.initializePayment);
router.post("/verify-transaction", paystack_controller_1.verifyPayment);
exports.default = router;
//# sourceMappingURL=paystack.router.js.map