import { createDb } from "@midas/db";
import * as schema from "@midas/db/schema/auth";
import { env } from "@midas/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Redis } from "ioredis";

export function createAuth() {
	const db = createDb();
	const isProduction = env.NODE_ENV === "production";
	const useSecureCookies = env.BETTER_AUTH_URL.startsWith("https://");
	const redis = isProduction ? new Redis(env.REDIS_URL) : null;

	redis?.on("error", (error) => {
		console.error("Better Auth Redis error", error);
	});

	const secondaryStorage = redis
		? {
				get: (key: string) => redis.get(key),
				set: (key: string, value: string, ttl?: number) =>
					ttl ? redis.set(key, value, "EX", ttl) : redis.set(key, value),
				delete: async (key: string) => {
					await redis.del(key);
				},
				getAndDelete: async (key: string) => {
					const results = await redis.multi().get(key).del(key).exec();
					return results?.[0]?.[1] ?? null;
				},
			}
		: undefined;

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
			useSecureCookies,
			...(isProduction
				? {
						defaultCookieAttributes: {
							sameSite: "none" as const,
							secure: true,
							httpOnly: true,
						},
					}
				: {}),
		},
		...(secondaryStorage ? { secondaryStorage } : {}),
		plugins: [],
	});
}

export const auth = createAuth();
