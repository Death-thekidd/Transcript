export interface PaystackEvent {
	event: string;
	data: {
		metadata: {
			transcriptRequestId: string;
		};
	};
}

export interface PaystackHeaders {
	"x-paystack-signature": string;
}
