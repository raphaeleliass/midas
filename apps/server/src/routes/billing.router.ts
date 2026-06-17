import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { db } from "@midas/db";
import type { HonoVariable } from "../HonoVariable.js";
import { zodErrorHook } from "../middlewares/zod-error.middleware.js";
import { BillingController } from "../modules/billing/billing.controller.js";
import { BillingRepository } from "../modules/billing/billing.repository.js";
import { BillingService } from "../modules/billing/billing.service.js";

const createCheckoutRoute = createRoute({
	method: "post",
	path: "/checkout",
	tags: ["Billing"],
	summary: "Create a checkout for the premium subscription",
	security: [{ bearerAuth: [] }],
	responses: {
		201: {
			content: {
				"application/json": {
					schema: z.object({ checkoutUrl: z.string().url() }),
				},
			},
			description: "Checkout URL to redirect the user",
		},
	},
});

const webhookRoute = createRoute({
	method: "post",
	path: "/webhook",
	tags: ["Billing"],
	summary: "AbacatePay webhook receiver",
	responses: {
		200: {
			content: {
				"application/json": { schema: z.object({ received: z.boolean() }) },
			},
			description: "Webhook received",
		},
		401: { description: "Invalid signature" },
	},
});

const statusRoute = createRoute({
	method: "get",
	path: "/status",
	tags: ["Billing"],
	summary: "Get current subscription status for the authenticated user",
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			content: {
				"application/json": {
					schema: z.object({
						isPremium: z.boolean(),
						status: z.enum(["active", "expired"]),
						currentPeriodEnd: z.date().nullable(),
					}),
				},
			},
			description: "Subscription status",
		},
	},
});

export const billingRouter = new OpenAPIHono<HonoVariable>({
	defaultHook: zodErrorHook,
});

const repository = new BillingRepository(db);
const service = new BillingService(repository);
const controller = new BillingController(service);

// biome-ignore lint/suspicious/noExplicitAny: controller DI pattern incompatible with openapi v1.x strict handler types
billingRouter.openapi(createCheckoutRoute, controller.createCheckout as any);
// biome-ignore lint/suspicious/noExplicitAny: controller DI pattern incompatible with openapi v1.x strict handler types
billingRouter.openapi(webhookRoute, controller.handleWebhook as any);
// biome-ignore lint/suspicious/noExplicitAny: controller DI pattern incompatible with openapi v1.x strict handler types
billingRouter.openapi(statusRoute, controller.getStatus as any);
