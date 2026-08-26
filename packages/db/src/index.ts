import { env } from "@midas/env/server";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

// When Neon's compute scales to zero, the first HTTP request wakes it up but
// may fail mid-flight. Retrying with exponential backoff (500ms → 1s → 2s)
// gives the compute time to resume — subsequent attempts land on a warm instance.
async function fetchWithRetry(
	url: Parameters<typeof fetch>[0],
	init?: Parameters<typeof fetch>[1],
): Promise<Response> {
	const MAX_ATTEMPTS = 3;

	for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
		try {
			return await fetch(url, init);
		} catch (err) {
			if (attempt === MAX_ATTEMPTS - 1) throw err;
			await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
		}
	}

	throw new Error("unreachable");
}

neonConfig.fetchFunction = fetchWithRetry;

export function createDb() {
	const sql = neon(env.DATABASE_URL);
	return drizzle(sql, { schema });
}

export const db = createDb();
export type DbType = typeof db;
export * from "./schema";
