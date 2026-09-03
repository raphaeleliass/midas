import type { Hook } from "@hono/zod-openapi";
import type { ZodType } from "zod";
import type { HonoVariable } from "../HonoVariable.js";

export const zodErrorHook: Hook<ZodType, HonoVariable, string, unknown> = (
	result,
	c,
) => {
	if ("error" in result) {
		const errors = result.error.issues.map((issue) => ({
			field: issue.path.join("."),
			message: issue.message,
		}));
		return c.json({ success: false, errors }, 422);
	}
};
