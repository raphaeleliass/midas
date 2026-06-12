import type { z } from "@hono/zod-openapi";
import type {
	categorySchema,
	createCategorySchema,
	updateCategorySchema,
} from "./categories.schema";

export type TCategory = z.infer<typeof categorySchema>;
export type TCreateCategory = z.infer<typeof createCategorySchema>;
export type TUpdateCategory = z.infer<typeof updateCategorySchema>;
