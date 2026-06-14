import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export const errorMiddleware = (err: Error, c: Context) => {
	if (err instanceof HTTPException) {
		return c.json({ error: err.message || "Request failed" }, err.status);
	}
	console.error(err);
	const cause = err.cause instanceof Error ? err.cause.message : undefined;
	return c.json(
		{
			error: "Internal server error",
			...(process.env.NODE_ENV !== "production" && {
				detail: err.message,
				cause,
			}),
		},
		500,
	);
};
