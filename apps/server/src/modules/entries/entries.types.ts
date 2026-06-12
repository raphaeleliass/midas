import type { z } from "@hono/zod-openapi";
import type {
	createEntrySchema,
	entrySchema,
	updateEntrySchema,
} from "./entries.schema";

export type TEntry = z.infer<typeof entrySchema>;
export type TCreateEntry = z.infer<typeof createEntrySchema>;
export type TUpdateEntry = z.infer<typeof updateEntrySchema>;
