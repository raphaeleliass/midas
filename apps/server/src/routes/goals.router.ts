import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { db, monthlyGoal } from "@midas/db";
import { eq } from "drizzle-orm";
import type { Context } from "hono";
import type { HonoVariable } from "../HonoVariable.js";
import { zodErrorHook } from "../middlewares/zod-error.middleware.js";
import { goalSchema, updateGoalSchema } from "../modules/goals/goals.schema.js";

type GoalUpdate = {
	expenseTargetCents?: number | null;
	incomeTargetCents?: number | null;
};

const getGoalsRoute = createRoute({
	method: "get",
	path: "/",
	tags: ["Goals"],
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			content: { "application/json": { schema: goalSchema } },
			description: "Goals for the authenticated user",
		},
	},
});

const updateGoalsRoute = createRoute({
	method: "patch",
	path: "/",
	tags: ["Goals"],
	security: [{ bearerAuth: [] }],
	request: {
		body: { content: { "application/json": { schema: updateGoalSchema } } },
	},
	responses: {
		200: {
			content: { "application/json": { schema: goalSchema } },
			description: "Updated goals",
		},
	},
});

export const goalsRouter = new OpenAPIHono<HonoVariable>({
	defaultHook: zodErrorHook,
});

// biome-ignore lint/suspicious/noExplicitAny: OpenAPI handler typing does not model auth middleware responses
goalsRouter.openapi(getGoalsRoute, (async (c: Context<HonoVariable>) => {
	const userId = c.get("userId");
	if (!userId) return c.json({ error: "Unauthorized" }, 401);
	const goal = await db.query.monthlyGoal.findFirst({
		where: eq(monthlyGoal.userId, userId),
	});
	return c.json({
		expenseTargetCents: goal?.expenseTargetCents ?? null,
		incomeTargetCents: goal?.incomeTargetCents ?? null,
	});
}) as any);

// biome-ignore lint/suspicious/noExplicitAny: OpenAPI handler typing does not model auth middleware responses
goalsRouter.openapi(updateGoalsRoute, (async (c: Context<HonoVariable>) => {
	const userId = c.get("userId");
	if (!userId) return c.json({ error: "Unauthorized" }, 401);
	const values = c.req.valid("json" as never) as GoalUpdate;
	const [goal] = await db
		.insert(monthlyGoal)
		.values({ userId, ...values })
		.onConflictDoUpdate({
			target: monthlyGoal.userId,
			set: values,
		})
		.returning();
	return c.json({
		expenseTargetCents: goal?.expenseTargetCents ?? null,
		incomeTargetCents: goal?.incomeTargetCents ?? null,
	});
}) as any);
