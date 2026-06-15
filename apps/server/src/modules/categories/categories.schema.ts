import { z } from "@hono/zod-openapi";

export const categorySchema = z
	.object({
		id: z.uuid(),
		name: z.string().min(1).max(50),
		icon: z.string().max(30).nullish(),
		color: z
			.string()
			.regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color (e.g. #a3b4c5)")
			.nullish(),
		userId: z.uuid().nullish(),
		createdAt: z.date(),
		updatedAt: z.date(),
	})
	.openapi("Category");

export const createCategorySchema = categorySchema
	.omit({ id: true, userId: true, createdAt: true, updatedAt: true })
	.openapi("CreateCategory");

export const updateCategorySchema = createCategorySchema
	.partial()
	.openapi("UpdateCategory");
