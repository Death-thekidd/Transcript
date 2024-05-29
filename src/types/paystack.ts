export interface PaystackEvent {
	event: string;
	data: {
		id: number; // Transaction ID
		amount: number; // Amount in kobo
		customer: {
			id: string;
			email: string;
			first_name: string;
			last_name: string;
		};
		currency: string;
		status: string;
		metadata: {
			transcriptRequestId: string;
			userId: string;
			name: string;
		};
	};
}

export interface PaystackHeaders {
	"x-paystack-signature": string;
}

export interface PaystackHeaders {
	"x-paystack-signature": string;
}
