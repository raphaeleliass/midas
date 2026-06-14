import type { MiddlewareHandler } from "hono";
import type { HonoVariable } from "../HonoVariable.js";

export const authMiddleware: MiddlewareHandler<HonoVariable> = async (
	c,
	next,
) => {
	const userId = c.get("userId");
	if (!userId) return c.json({ error: "Unauthorized" }, 401);
	await next();
};
