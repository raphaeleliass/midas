import type { OpenAPIHono } from "@hono/zod-openapi";
import type { HonoVariable } from "../HonoVariable.js";
import { categoriesRouter } from "./categories.router.js";
import { entriesRouter } from "./entries.router.js";

export function registerRoutes(app: OpenAPIHono<HonoVariable>) {
	app.route("/entries", entriesRouter);
	app.route("/categories", categoriesRouter);
}
