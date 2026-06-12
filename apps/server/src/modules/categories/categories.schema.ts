import { z } from "zod";

// ── Input schemas (API requests) ─────────────────────────────────────────────

export const createCategorySchema = z.object({
	name: z.string().min(1).max(50),
	icon: z.string().max(10).optional(),
	color: z
		.string()
		.regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color (e.g. #a3b4c5)")
		.optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// ── Response schema (API responses) ──────────────────────────────────────────

export const categorySchema = z.object({
	id: z.string(),
	name: z.string(),
	icon: z.string().nullable(),
	color: z.string().nullable(),
	userId: z.string().nullable(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

// ── Types ─────────────────────────────────────────────────────────────────────

export type CreateCategory = z.infer<typeof createCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;
export type Category = z.infer<typeof categorySchema>;
