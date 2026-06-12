import { relations } from "drizzle-orm";
import { index, integer, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
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
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("entry_userId_idx").on(table.userId)],
);

export const entryCategory = pgTable(
	"entry_category",
	{
		entryId: text("entry_id")
			.notNull()
			.references(() => entry.id, { onDelete: "cascade" }),
		categoryId: text("category_id")
			.notNull()
			.references(() => category.id, { onDelete: "cascade" }),
	},
	(table) => [primaryKey({ columns: [table.entryId, table.categoryId] })],
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
