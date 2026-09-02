import { OpenAPIHono } from "@hono/zod-openapi";
import { auth } from "@midas/auth";
import { env } from "@midas/env/server";
import { Scalar } from "@scalar/hono-api-reference";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import type { HonoVariable } from "./HonoVariable.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { zodErrorHook } from "./middlewares/zod-error.middleware.js";
import { registerRoutes } from "./routes/index.js";

export const app = new OpenAPIHono<HonoVariable>({ defaultHook: zodErrorHook });

app.use(logger());
app.use(secureHeaders());
app.use(
	"/*",
	bodyLimit({
		maxSize: 16 * 1024,
		onError: (c) => c.json({ error: "Payload too large" }, 413),
	}),
);
app.use(
	"/*",
	cors({
		origin: env.CORS_ORIGIN,
		allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.use("*", async (c, next) => {
	const session = await auth.api
		.getSession({ headers: c.req.raw.headers })
		.catch(() => null);
	if (!session) {
		c.set("user", null);
		c.set("session", null);
		c.set("userId", null);
	} else {
		c.set("user", session.user);
		c.set("session", session.session);
		c.set("userId", session.user.id);
	}
	await next();
});

app.use("/entries", authMiddleware);
app.use("/entries/*", authMiddleware);
app.use("/categories", authMiddleware);
app.use("/categories/*", authMiddleware);

app.onError(errorMiddleware);

registerRoutes(app);

app.openAPIRegistry.registerComponent("securitySchemes", "bearerAuth", {
	type: "http",
	scheme: "bearer",
	bearerFormat: "JWT",
});

app.doc("doc", {
	openapi: "3.0.0",
	info: {
		title: "Midas API",
		version: "1.0.0",
		description:
			"API de gestão de finanças pessoais. Entradas, gastos e categorias.",
	},
	servers: [{ url: env.BETTER_AUTH_URL, description: "Local" }],
	tags: [
		{ name: "Entries", description: "Registro de gastos e receitas" },
		{ name: "Categories", description: "Categorias de entradas" },
	],
});

app.get(
	"/scalar",
	Scalar({
		url: "doc",
		pageTitle: "Midas API",
		theme: "kepler",
		layout: "modern",
		darkMode: true,
		defaultHttpClient: { targetKey: "js", clientKey: "fetch" },
		authentication: { preferredSecurityScheme: "bearerAuth" },
	}),
);

app.get("/", (c) => {
	return c.text("OK");
});
