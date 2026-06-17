import { relations } from "drizzle-orm";
import {
	index,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const subscription = pgTable(
	"subscription",
	{
		id: uuid("id").primaryKey().defaultRandom().notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		status: text("status", { enum: ["active", "expired"] })
			.notNull()
			.default("expired"),
		abacateCheckoutId: text("abacate_checkout_id"),
		abacateBillingId: text("abacate_billing_id"),
		currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("subscription_userId_idx").on(table.userId),
		unique("subscription_userId_unique").on(table.userId),
	],
);

export const subscriptionRelations = relations(subscription, ({ one }) => ({
	user: one(user, {
		fields: [subscription.userId],
		references: [user.id],
	}),
}));
