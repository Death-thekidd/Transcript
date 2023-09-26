import { Request, Response, NextFunction } from "express";
import https from "https";
import { PAYSTACK_PUBLIC_KEY, PAYSTACK_SECRET_KEY } from "../util/secrets";
import crypto from "crypto";
import { TranscriptRequest } from "../models/transcript-request.model";

/**
 * Initialize Paystack payment gateway
 * @route POST /initialize-payment
 */
export const initializePayment = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	try {
		// request body from the clients
		const { email, transcriptRequestId } = req.body;
		const transcriptRequest = await TranscriptRequest.findByPk(
			transcriptRequestId
		);
		const destinations = await transcriptRequest.getDestinations();
		const transcriptType = await transcriptRequest.getTranscriptType();

		const destinationtotal = destinations.reduce(
			(acc, destination) => (acc += destination.rate),
			0
		);
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
				Authorization: PAYSTACK_PUBLIC_KEY,
				"Content-Type": "application/json",
			},
		};
		const clientReq = https
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
			.on("error", (error: Error) => {
				console.error(error);
				res.status(500).json({ error: "An error occurred" }); // Send error response
			});
		clientReq.write(params);
		clientReq.end();
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "An error occurred" });
	}
};

/**
 * Paystack webhook url
 * @route POST /verify-transaction
 */
export const verifyPayment = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	//validate event
	const hash = crypto
		.createHmac("sha512", PAYSTACK_SECRET_KEY)
		.update(JSON.stringify(req.body))
		.digest("hex");

	if (hash == req.headers["x-paystack-signature"]) {
		// Retrieve the request's body
		const event = req.body;
		// Do something with event
		if (event && event.event === "charge.success") {
			const {
				metadata: { transcriptRequestId },
			} = event.data;

			const transcriptRequest = await TranscriptRequest.update(
				{ isPaid: true },
				{ where: { id: transcriptRequestId } }
			);
			return res
				.status(200)
				.json({ message: "payment successfull", data: transcriptRequest });
		}
	}

	res.send(200);
};
