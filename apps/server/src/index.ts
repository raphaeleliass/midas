import { OpenAPIHono } from "@hono/zod-openapi";
import { auth } from "@midas/auth";
import { env } from "@midas/env/server";
import { Scalar } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { registerRoutes } from "./routes/index.js";

const app = new OpenAPIHono();

app.use(logger());
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

import { serve } from "@hono/node-server";

serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
