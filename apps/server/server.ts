import { Hono } from "hono";
import { app } from "./src/app.js";

// Vercel detects Hono applications through a direct runtime import.
void Hono;

export default app;
