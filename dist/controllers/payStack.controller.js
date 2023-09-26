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
const https_1 = __importDefault(require("https"));
const secrets_1 = require("../util/secrets");
const crypto_1 = __importDefault(require("crypto"));
const transcript_request_model_1 = require("../models/transcript-request.model");
/**
 * Initialize Paystack payment gateway
 * @route POST /initialize-payment
 */
const initializePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // request body from the clients
        const { email, transcriptRequestId } = req.body;
        const transcriptRequest = yield transcript_request_model_1.TranscriptRequest.findByPk(transcriptRequestId);
        const destinations = yield transcriptRequest.getDestinations();
        const transcriptType = yield transcriptRequest.getTranscriptType();
        const destinationtotal = destinations.reduce((acc, destination) => (acc += destination.rate), 0);
        const amount = destinationtotal + transcriptType.amount;
        // params
        const params = JSON.stringify({
            email: email,
            amount: amount,
            metadata: {
                transcriptRequestId,
            },
        });
        // options
        const options = {
            hostname: "api.paystack.co",
            port: 443,
            path: "/transaction/initialize",
            method: "POST",
            headers: {
                Authorization: secrets_1.PAYSTACK_PUBLIC_KEY,
                "Content-Type": "application/json",
            },
        };
        const clientReq = https_1.default
            .request(options, (apiRes) => {
            let data = "";
            apiRes.on("data", (chunk) => {
                data += chunk;
            });
            apiRes.on("end", () => {
                console.log(JSON.parse(data));
                return res.status(200).json(data);
            });
        })
            .on("error", (error) => {
            console.error(error);
            res.status(500).json({ error: "An error occurred" }); // Send error response
        });
        clientReq.write(params);
        clientReq.end();
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
});
exports.initializePayment = initializePayment;
/**
 * Paystack webhook url
 * @route POST /verify-transaction
 */
const verifyPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //validate event
    const hash = crypto_1.default
        .createHmac("sha512", secrets_1.PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(req.body))
        .digest("hex");
    if (hash == req.headers["x-paystack-signature"]) {
        // Retrieve the request's body
        const event = req.body;
        // Do something with event
        if (event && event.event === "charge.success") {
            const { metadata: { transcriptRequestId }, } = event.data;
            const transcriptRequest = yield transcript_request_model_1.TranscriptRequest.update({ isPaid: true }, { where: { id: transcriptRequestId } });
            return res
                .status(200)
                .json({ message: "payment successfull", data: transcriptRequest });
        }
    }
    res.send(200);
});
exports.verifyPayment = verifyPayment;
//# sourceMappingURL=payStack.controller.js.map