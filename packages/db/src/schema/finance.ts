import { relations, sql } from "drizzle-orm";
import {
	check,
	index,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const category = pgTable(
	"category",
	{
		id: uuid("id").primaryKey().defaultRandom().notNull(),
		name: text("name").notNull(),
		icon: text("icon"),
		color: text("color"),
		userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("category_userId_idx").on(table.userId)],
);

export const entry = pgTable(
	"entry",
	{
		id: uuid("id").primaryKey().defaultRandom().notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		type: text("type", { enum: ["expense", "income"] }).notNull(),
		title: text("title").notNull(),
		subtitle: text("subtitle"),
		amountCents: integer("amount_cents").notNull(),
		date: timestamp("date", { withTimezone: true }).notNull(),
		status: text("status", { enum: ["posted", "scheduled"] })
			.default("posted")
			.notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("entry_userId_idx").on(table.userId),
		index("entry_userId_status_date_idx").on(
			table.userId,
			table.status,
			table.date,
		),
		check("entry_amount_cents_positive", sql`${table.amountCents} > 0`),
		check("entry_type_allowed", sql`${table.type} in ('expense', 'income')`),
		check(
			"entry_status_allowed",
			sql`${table.status} in ('posted', 'scheduled')`,
		),
	],
);

export const entryCategory = pgTable(
	"entry_category",
	{
		entryId: uuid("entry_id")
			.notNull()
			.references(() => entry.id, { onDelete: "cascade" }),
		categoryId: uuid("category_id")
			.notNull()
			.references(() => category.id, { onDelete: "cascade" }),
	},
	(table) => [primaryKey({ columns: [table.entryId, table.categoryId] })],
);

export const monthlyGoal = pgTable(
	"monthly_goal",
	{
		userId: text("user_id")
			.primaryKey()
			.references(() => user.id, { onDelete: "cascade" }),
		expenseTargetCents: integer("expense_target_cents"),
		incomeTargetCents: integer("income_target_cents"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		check(
			"monthly_goal_expense_target_positive",
			sql`${table.expenseTargetCents} is null or ${table.expenseTargetCents} > 0`,
		),
		check(
			"monthly_goal_income_target_positive",
			sql`${table.incomeTargetCents} is null or ${table.incomeTargetCents} > 0`,
		),
	],
);

export const entryRelations = relations(entry, ({ one, many }) => ({
	user: one(user, {
		fields: [entry.userId],
		references: [user.id],
	}),
	entryCategories: many(entryCategory),
}));

export const categoryRelations = relations(category, ({ one, many }) => ({
	user: one(user, {
		fields: [category.userId],
		references: [user.id],
	}),
	entryCategories: many(entryCategory),
}));

export const entryCategoryRelations = relations(entryCategory, ({ one }) => ({
	entry: one(entry, {
		fields: [entryCategory.entryId],
		references: [entry.id],
	}),
	category: one(category, {
		fields: [entryCategory.categoryId],
		references: [category.id],
	}),
}));
