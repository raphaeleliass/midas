declare module "@abacatepay/sdk" {
	interface CheckoutBody {
		externalId?: string;
		items: { id: string; quantity: number }[];
		completionUrl?: string;
		returnUrl?: string;
	}

	interface Checkout {
		id: string;
		url: string;
		status: string;
		amount: number;
	}

	interface AbacateClient {
		checkouts: {
			create(body: CheckoutBody): Promise<Checkout>;
		};
	}

	export function AbacatePay(options: { secret?: string }): AbacateClient;
}
