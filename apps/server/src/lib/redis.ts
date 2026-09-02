import { env } from "@midas/env/server";
import { Redis } from "ioredis";

type CacheClient = {
	get(key: string): Promise<string | null>;
	set(key: string, value: string, mode: "EX", ttl: number): Promise<unknown>;
	del(...keys: string[]): Promise<number>;
};

class MemoryCache implements CacheClient {
	private readonly entries = new Map<
		string,
		{ value: string; expiresAt: number }
	>();

	async get(key: string): Promise<string | null> {
		const entry = this.entries.get(key);
		if (!entry) return null;

		if (entry.expiresAt <= Date.now()) {
			this.entries.delete(key);
			return null;
		}

		return entry.value;
	}

	async set(
		key: string,
		value: string,
		_mode: "EX",
		ttl: number,
	): Promise<void> {
		this.entries.set(key, { value, expiresAt: Date.now() + ttl * 1_000 });
	}

	async del(...keys: string[]): Promise<number> {
		return keys.reduce((deleted, key) => {
			return this.entries.delete(key) ? deleted + 1 : deleted;
		}, 0);
	}
}

export const redis: CacheClient =
	env.NODE_ENV === "production" ? new Redis(env.REDIS_URL) : new MemoryCache();
