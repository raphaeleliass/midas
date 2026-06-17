import type { Context } from "hono";
import type { HonoVariable } from "../../HonoVariable.js";
import type { BillingService } from "./billing.service.js";

type AppContext = Context<HonoVariable>;

export class BillingController {
	constructor(private readonly service: BillingService) {}

	createCheckout = async (c: AppContext) => {
		const userId = c.get("userId") || "";
		const result = await this.service.createCheckout(userId);
		return c.json(result, 201);
	};

	handleWebhook = async (c: AppContext) => {
		const rawBody = await c.req.raw.text();
		const signature = c.req.header("x-webhook-signature") ?? "";
		await this.service.handleWebhook(rawBody, signature);
		return c.json({ received: true });
	};

	getStatus = async (c: AppContext) => {
		const userId = c.get("userId") || "";
		const status = await this.service.getStatus(userId);
		return c.json(status);
	};
}
