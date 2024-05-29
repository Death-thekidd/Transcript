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
exports.verifyPayment = exports.initializePayment = void 0;
// services/paymentService.ts
const https_1 = __importDefault(require("https"));
const secrets_1 = require("../util/secrets");
const crypto_1 = __importDefault(require("crypto"));
const transcriptrequest_1 = __importDefault(require("../database/models/transcriptrequest"));
const transaction_1 = __importDefault(require("../database/models/transaction"));
const initializePayment = ({ email, transcriptRequestId, }) => __awaiter(void 0, void 0, void 0, function* () {
    const transcriptRequest = yield transcriptrequest_1.default.findByPk(transcriptRequestId);
    if (!transcriptRequest)
        throw new Error("Transcript request not found");
    const destinations = yield transcriptRequest.getDestinations();
    const transcriptType = yield transcriptRequest.getTranscriptType();
    const destinationTotal = destinations.reduce((acc, destination) => acc + destination.rate, 0);
    const amount = destinationTotal + transcriptType.amount;
    const params = JSON.stringify({
        email,
        amount,
        metadata: { transcriptRequestId },
    });
    const options = {
        hostname: "api.paystack.co",
        port: 443,
        path: "/transaction/initialize",
        method: "POST",
        headers: {
            Authorization: `Bearer ${secrets_1.PAYSTACK_PUBLIC_KEY}`,
            "Content-Type": "application/json",
        },
    };
    return new Promise((resolve, reject) => {
        const clientReq = https_1.default.request(options, (apiRes) => {
            let data = "";
            apiRes.on("data", (chunk) => {
                data += chunk;
            });
            apiRes.on("end", () => {
                resolve(JSON.parse(data));
            });
        });
        clientReq.on("error", (error) => {
            reject(error);
        });
        clientReq.write(params);
        clientReq.end();
    });
});
exports.initializePayment = initializePayment;
const verifyPayment = (reqBody, headers) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = crypto_1.default
        .createHmac("sha512", secrets_1.PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(reqBody))
        .digest("hex");
    if (hash === headers["x-paystack-signature"]) {
        const event = reqBody;
        if (event && event.event === "charge.success") {
            const { id: transactionId, customer: { email }, amount, metadata: { transcriptRequestId, userId, name }, } = event.data;
            const [affectedCount] = yield transcriptrequest_1.default.update({ status: "paid" }, { where: { id: transcriptRequestId } });
            if (affectedCount > 0) {
                // Record the transaction
                yield transaction_1.default.create({
                    userId,
                    transactionId,
                    name,
                    email,
                    amount: amount / 100,
                    currency: "NGN",
                    paymentStatus: "paid",
                    paymentGateway: "paystack",
                });
                return yield transcriptrequest_1.default.findByPk(transcriptRequestId);
            }
        }
    }
    return null;
});
exports.verifyPayment = verifyPayment;
//# sourceMappingURL=paystack.service.js.map