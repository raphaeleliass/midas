import { redis } from "./redis";

export async function getCache<T>(key: string): Promise<T | null> {
	const data = await redis.get(key);
	if (!data) {
		console.log(`[cache] MISS ${key}`);
		return null;
	}
	console.log(`[cache] HIT  ${key}`);
	return JSON.parse(data) as T;
}

export async function setCache<T>(
	key: string,
	value: T,
	ttlSeconds: number,
): Promise<void> {
	await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
	console.log(`[cache] SET  ${key} (ttl: ${ttlSeconds}s)`);
}

export async function delCache(...keys: string[]): Promise<void> {
	if (keys.length === 0) return;
	await redis.del(...(keys as [string, ...string[]]));
	console.log(`[cache] DEL  ${keys.join(", ")}`);
}
