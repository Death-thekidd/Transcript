// controllers/paymentController.ts
import { Request, Response } from "express";
import * as paymentService from "../services/paystack.service";
import { PaystackEvent, PaystackHeaders } from "../types/paystack";

export const initializePayment = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const { email, transcriptRequestId } = req.body;
		const response = await paymentService.initializePayment({
			email,
			transcriptRequestId,
		});
		return res.status(200).json(response);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "An error occurred" });
	}
};

export const verifyPayment = async (
	req: Request,
	res: Response
): Promise<Response> => {
	try {
		const transcriptRequest = await paymentService.verifyPayment(
			req.body as PaystackEvent,
			req.headers as unknown as PaystackHeaders
		);
		if (transcriptRequest) {
			return res
				.status(200)
				.json({ message: "Payment successful", data: transcriptRequest });
		}
		return res.status(200).send();
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "An error occurred" });
	}
};
