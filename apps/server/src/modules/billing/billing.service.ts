import { createHmac, timingSafeEqual } from "node:crypto";
import { ABACATEPAY_SHARED_KEY } from "@abacatepay/types";
import { env } from "@midas/env/server";
import { HTTPException } from "hono/http-exception";
import { abacate } from "../../lib/abacate.js";
import type { BillingRepository } from "./billing.repository.js";

function verifyWebhookSignature(rawBody: string, signature: string): boolean {
	const expected = createHmac("sha256", ABACATEPAY_SHARED_KEY)
		.update(Buffer.from(rawBody, "utf8"))
		.digest("base64");
	const a = Buffer.from(expected);
	const b = Buffer.from(signature);
	return a.length === b.length && timingSafeEqual(a, b);
}

const SUBSCRIPTION_DURATION_DAYS = 30;

export class BillingService {
	constructor(private readonly repository: BillingRepository) {}

	createCheckout = async (userId: string) => {
		const checkout = await abacate.checkouts.create({
			externalId: userId,
			items: [{ id: env.ABACATEPAY_PRODUCT_ID, quantity: 1 }],
			completionUrl: `${env.CORS_ORIGIN}/settings`,
			returnUrl: `${env.CORS_ORIGIN}/settings`,
		});
		return { checkoutUrl: checkout.url };
	};

	handleWebhook = async (rawBody: string, signature: string) => {
		if (!verifyWebhookSignature(rawBody, signature)) {
			throw new HTTPException(401, { message: "Invalid webhook signature" });
		}

		const event = JSON.parse(rawBody) as {
			event: string;
			data: {
				billing?: { id: string; externalId: string };
			};
		};

		if (event.event !== "billing.paid") return;

		const billing = event.data.billing;
		if (!billing?.externalId) return;

		const userId = billing.externalId;
		const currentPeriodEnd = new Date();
		currentPeriodEnd.setDate(
			currentPeriodEnd.getDate() + SUBSCRIPTION_DURATION_DAYS,
		);

		await this.repository.upsert(userId, {
			status: "active",
			abacateBillingId: billing.id,
			currentPeriodEnd,
		});
	};

	getStatus = async (userId: string) => {
		const sub = await this.repository.getByUserId(userId);
		const isPremium =
			sub?.status === "active" &&
			sub.currentPeriodEnd != null &&
			sub.currentPeriodEnd > new Date();

		return {
			isPremium,
			status: sub?.status ?? "expired",
			currentPeriodEnd: sub?.currentPeriodEnd ?? null,
		};
	};

	isPremium = async (userId: string) => {
		const { isPremium } = await this.getStatus(userId);
		return isPremium;
	};
}
