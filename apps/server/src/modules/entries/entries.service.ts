import { HTTPException } from "hono/http-exception";
import { delCache, getCache, setCache } from "../../lib/cache";
import type { EntriesRepository } from "./entries.repository";
import type { TCreateEntry, TUpdateEntry } from "./entries.types";

type EntryList = Awaited<ReturnType<EntriesRepository["findManyByUser"]>>;
type Entry = NonNullable<Awaited<ReturnType<EntriesRepository["findById"]>>>;

function getEntryStatus(date: string) {
	const dateKey = new Intl.DateTimeFormat("en-CA", {
		timeZone: "America/Sao_Paulo",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date(date));
	const todayKey = new Intl.DateTimeFormat("en-CA", {
		timeZone: "America/Sao_Paulo",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date());
	return dateKey > todayKey ? "scheduled" : "posted";
}

export class EntriesService {
	constructor(private readonly repository: EntriesRepository) {}

	private async assertAccessibleCategories(
		userId: string,
		categoryIds?: string[],
	) {
		if (!categoryIds) return;
		const uniqueCategoryIds = [...new Set(categoryIds)];
		const count = await this.repository.countAccessibleCategories(
			userId,
			uniqueCategoryIds,
		);
		if (count !== uniqueCategoryIds.length) {
			throw new HTTPException(422, { message: "Invalid category selection" });
		}
	}

	create = async (userId: string, data: TCreateEntry) => {
		await this.assertAccessibleCategories(userId, data.categoryIds);
		const result = await this.repository.create(
			data,
			userId,
			getEntryStatus(data.date),
		);
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
		await this.postDueScheduled(userId);
		const cacheKey = `entries:${userId}`;
		const cached = await getCache<EntryList>(cacheKey);
		if (cached) return cached;

		const result = await this.repository.findManyByUser(userId);
		await setCache(cacheKey, result, 300);
		return result;
	};

	findManyByMonth = async (userId: string, month: string) => {
		await this.postDueScheduled(userId);
		return this.repository.findManyByMonth(userId, month);
	};

	update = async (userId: string, id: string, data: TUpdateEntry) => {
		const found = await this.repository.findById(id);

		if (!found) throw new HTTPException(404);
		if (found.userId !== userId) throw new HTTPException(403);
		await this.assertAccessibleCategories(userId, data.categoryIds);

		const result = await this.repository.update(
			id,
			data,
			data.date ? getEntryStatus(data.date) : found.status,
		);
		await delCache(`entries:${userId}`, `entries:${userId}:${id}`);
		return result;
	};

	private async postDueScheduled(userId: string) {
		const posted = await this.repository.postDueScheduled(userId);
		if (posted.length) await delCache(`entries:${userId}`);
	}

	delete = async (userId: string, id: string) => {
		const found = await this.repository.findById(id);

		if (!found) throw new HTTPException(404);
		if (found.userId !== userId) throw new HTTPException(403);

		const result = await this.repository.delete(id);
		await delCache(`entries:${userId}`, `entries:${userId}:${id}`);
		return result;
	};
}
