import { redis } from "./redis";

export async function getCache<T>(key: string): Promise<T | null> {
	const data = await redis.get(key);
	if (!data) return null;
	return JSON.parse(data) as T;
}

export async function setCache<T>(
	key: string,
	value: T,
	ttlSeconds: number,
): Promise<void> {
	await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
}

export async function delCache(...keys: string[]): Promise<void> {
	if (keys.length === 0) return;
	await redis.del(...(keys as [string, ...string[]]));
}
