import { HTTPException } from "hono/http-exception";
import { delCache, getCache, setCache } from "../../lib/cache";
import type { EntriesRepository } from "./entries.repository";
import type { TCreateEntry, TUpdateEntry } from "./entries.types";

type EntryList = Awaited<ReturnType<EntriesRepository["findManyByUser"]>>;
type Entry = NonNullable<Awaited<ReturnType<EntriesRepository["findById"]>>>;

export class EntriesService {
	constructor(private readonly repository: EntriesRepository) {}

	create = async (userId: string, data: TCreateEntry) => {
		const result = await this.repository.create(data, userId);
		await delCache(`entries:${userId}`);
		return result;
	};

	findById = async (userId: string, id: string) => {
		const cacheKey = `entries:${userId}:${id}`;
		const cached = await getCache<Entry>(cacheKey);
		if (cached) return cached;

		const found = await this.repository.findById(id);

		if (!found) throw new HTTPException(404);
		if (found.userId !== userId) throw new HTTPException(403);

		await setCache(cacheKey, found, 600);
		return found;
	};

	findManyByUser = async (userId: string) => {
		const cacheKey = `entries:${userId}`;
		const cached = await getCache<EntryList>(cacheKey);
		if (cached) return cached;

		const result = await this.repository.findManyByUser(userId);
		await setCache(cacheKey, result, 300);
		return result;
	};

	update = async (userId: string, id: string, data: TUpdateEntry) => {
		const found = await this.repository.findById(id);

		if (!found) throw new HTTPException(404);
		if (found.userId !== userId) throw new HTTPException(403);

		const result = await this.repository.update(id, data);
		await delCache(`entries:${userId}`, `entries:${userId}:${id}`);
		return result;
	};

	delete = async (userId: string, id: string) => {
		const found = await this.repository.findById(id);

		if (!found) throw new HTTPException(404);
		if (found.userId !== userId) throw new HTTPException(403);

		const result = await this.repository.delete(id);
		await delCache(`entries:${userId}`, `entries:${userId}:${id}`);
		return result;
	};
}
