import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const server = {
	DATABASE_URL: z.string().min(1),
	BETTER_AUTH_SECRET: z.string().min(32),
	BETTER_AUTH_URL: z.url(),
	CORS_ORIGIN: z.url(),
	REDIS_URL: z.string().min(1),
	INITIAL_ADMIN_EMAILS: z
		.string()
		.optional()
		.transform((value) =>
			(value ?? "")
				.split(",")
				.map((email) => email.trim().toLowerCase())
				.filter(Boolean),
		),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
};

export const env = createEnv<undefined, typeof server>({
	server,
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
		CORS_ORIGIN: process.env.CORS_ORIGIN,
		REDIS_URL: process.env.REDIS_URL,
		INITIAL_ADMIN_EMAILS: process.env.INITIAL_ADMIN_EMAILS,
		NODE_ENV: process.env.NODE_ENV,
	},
	emptyStringAsUndefined: true,
});
