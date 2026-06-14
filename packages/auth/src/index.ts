import { createDb } from "@midas/db";
import * as schema from "@midas/db/schema/auth";
import { env } from "@midas/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Redis } from "ioredis";

export function createAuth() {
	const db = createDb();
	const redis = new Redis(env.REDIS_URL);

	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "pg",

			schema: schema,
		}),
		trustedOrigins: [env.CORS_ORIGIN],
		session: {
			cookieCache: {
				enabled: true,
				maxAge: 5 * 60,
			},
		},
		emailAndPassword: {
			enabled: true,
		},
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
		advanced: {
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				httpOnly: true,
			},
		},
		secondaryStorage: {
			get: (key) => redis.get(key),
			set: (key, value, ttl) =>
				ttl ? redis.set(key, value, "EX", ttl) : redis.set(key, value),
			delete: async (key) => {
				await redis.del(key);
			},
			getAndDelete: async (key) => {
				const results = await redis.multi().get(key).del(key).exec();
				return results?.[0]?.[1] ?? null;
			},
		},
		plugins: [],
	});
}

export const auth = createAuth();
