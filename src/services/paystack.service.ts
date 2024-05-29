// services/paymentService.ts
import https from "https";
import { PAYSTACK_PUBLIC_KEY, PAYSTACK_SECRET_KEY } from "../util/secrets";
import crypto from "crypto";
import TranscriptRequest from "../database/models/transcriptrequest";
import { PaystackEvent, PaystackHeaders } from "../types/paystack";
import Transaction from "../database/models/transaction";

interface InitializePaymentParams {
	email: string;
	transcriptRequestId: string;
}

interface PaystackResponse {
	status: boolean;
	message: string;
	data: {
		authorization_url: string;
		access_code: string;
		reference: string;
	};
}

export const initializePayment = async ({
	email,
	transcriptRequestId,
}: InitializePaymentParams): Promise<PaystackResponse> => {
	const transcriptRequest = await TranscriptRequest.findByPk(
		transcriptRequestId
	);
	if (!transcriptRequest) throw new Error("Transcript request not found");
	const destinations = await transcriptRequest.getDestinations();
	const transcriptType = await transcriptRequest.getTranscriptType();

	const destinationTotal = destinations.reduce(
		(acc, destination) => acc + destination.rate,
		0
	);
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
			Authorization: `Bearer ${PAYSTACK_PUBLIC_KEY}`,
			"Content-Type": "application/json",
		},
	};

	return new Promise((resolve, reject) => {
		const clientReq = https.request(options, (apiRes) => {
			let data = "";
			apiRes.on("data", (chunk) => {
				data += chunk;
			});
			apiRes.on("end", () => {
				resolve(JSON.parse(data));
			});
		});

		clientReq.on("error", (error: Error) => {
			reject(error);
		});

		clientReq.write(params);
		clientReq.end();
	});
};

export const verifyPayment = async (
	reqBody: PaystackEvent,
	headers: PaystackHeaders
): Promise<TranscriptRequest | null> => {
	const hash = crypto
		.createHmac("sha512", PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(reqBody))
		.digest("hex");

	if (hash === headers["x-paystack-signature"]) {
		const event = reqBody;
		if (event && event.event === "charge.success") {
			const {
				id: transactionId,
				customer: { email },
				amount,
				metadata: { transcriptRequestId, userId, name },
			} = event.data;

			const [affectedCount] = await TranscriptRequest.update(
				{ status: "paid" },
				{ where: { id: transcriptRequestId } }
			);

			if (affectedCount > 0) {
				// Record the transaction
				await Transaction.create({
					userId,
					transactionId,
					name,
					email,
					amount: amount / 100, // Assuming amount is in kobo and converting to Naira
					currency: "NGN",
					paymentStatus: "paid",
					paymentGateway: "paystack",
				});

				return await TranscriptRequest.findByPk(transcriptRequestId);
			}
		}
	}

	return null;
};
