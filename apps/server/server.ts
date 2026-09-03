import { Hono } from "hono";
import type { app as App } from "./src/app.js";

// Vercel detects Hono applications through a direct runtime import.
void Hono;

const { default: app } = (await import(
	new URL("./dist/handler.mjs", import.meta.url).href
)) as { default: typeof App };

export default app;
