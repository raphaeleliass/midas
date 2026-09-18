import { z } from "@hono/zod-openapi";

export const goalSchema = z.object({
	expenseTargetCents: z.number().int().positive().nullable(),
	incomeTargetCents: z.number().int().positive().nullable(),
});

export const updateGoalSchema = goalSchema
	.partial()
	.refine(
		(value) =>
			value.expenseTargetCents !== undefined ||
			value.incomeTargetCents !== undefined,
		"Informe ao menos uma meta",
	);
