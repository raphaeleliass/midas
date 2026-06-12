import { z } from "@hono/zod-openapi";
import { categorySchema } from "../categories/categories.schema";

export const entrySchema = z
	.object({
		id: z.uuid(),
		userId: z.uuid(),
		type: z.enum(["expense", "income"]),
		title: z.string().min(1).max(100),
		subtitle: z.string().max(200).nullish(),
		amountCents: z.number().int().positive(),
		date: z.date(),
		createdAt: z.date(),
		updatedAt: z.date(),
		categories: z.array(categorySchema).optional(),
	})
	.openapi("Entry");

export const createEntrySchema = entrySchema
	.omit({
		id: true,
		userId: true,
		createdAt: true,
		updatedAt: true,
		categories: true,
		date: true,
	})
	.extend({
		/** ISO 8601 datetime string with timezone */
		date: z.string().datetime({ offset: true }),
		/** IDs of categories to attach to this entry */
		categoryIds: z.array(z.uuid()).optional(),
	})
	.openapi("CreateEntry");

export const updateEntrySchema = createEntrySchema
	.partial()
	.openapi("UpdateEntry");
