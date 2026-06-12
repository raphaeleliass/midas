import { z } from "zod";
import { categorySchema } from "../categories/categories.schema";

// ── Input schemas (API requests) ─────────────────────────────────────────────

export const createEntrySchema = z.object({
	type: z.enum(["expense", "income"]),
	title: z.string().min(1).max(100),
	subtitle: z.string().max(200).optional(),
	/** Value in cents. Example: R$10,50 → 1050 */
	amountCents: z.number().int().positive(),
	/** ISO 8601 datetime string with timezone */
	date: z.string().datetime({ offset: true }),
	/** IDs of categories to attach to this entry */
	categoryIds: z.array(z.string()).optional(),
});

export const updateEntrySchema = createEntrySchema.partial();

// ── Response schema (API responses) ──────────────────────────────────────────

export const entrySchema = z.object({
	id: z.string(),
	userId: z.string(),
	type: z.enum(["expense", "income"]),
	title: z.string(),
	subtitle: z.string().nullable(),
	amountCents: z.number().int(),
	date: z.string().datetime(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	categories: z.array(categorySchema).optional(),
});

// ── Types ─────────────────────────────────────────────────────────────────────

export type CreateEntry = z.infer<typeof createEntrySchema>;
export type UpdateEntry = z.infer<typeof updateEntrySchema>;
export type Entry = z.infer<typeof entrySchema>;
