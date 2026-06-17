import type { DbType } from "@midas/db";
import { subscription } from "@midas/db";
import { eq } from "drizzle-orm";

export class BillingRepository {
	constructor(private readonly db: DbType) {}

	getByUserId = async (userId: string) => {
		const found = await this.db.query.subscription.findFirst({
			where: eq(subscription.userId, userId),
		});
		return found ?? null;
	};

	upsert = async (
		userId: string,
		data: {
			status: "active" | "expired";
			abacateBillingId?: string;
			abacateCheckoutId?: string;
			currentPeriodEnd?: Date;
		},
	) => {
		const [result] = await this.db
			.insert(subscription)
			.values({ userId, ...data })
			.onConflictDoUpdate({
				target: subscription.userId,
				set: { ...data, updatedAt: new Date() },
			})
			.returning();
		return result ?? null;
	};
}
