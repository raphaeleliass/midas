import { HTTPException } from "hono/http-exception";
import { delCache, getCache, setCache } from "../../lib/cache";
import type { CategoriesRepository } from "./categories.repository";
import type { TCreateCategory, TUpdateCategory } from "./categories.types";

type CategoryList = Awaited<ReturnType<CategoriesRepository["findManyByUser"]>>;
type Category = NonNullable<
	Awaited<ReturnType<CategoriesRepository["findById"]>>
>;

export class CategoriesService {
	constructor(
		private readonly repository: CategoriesRepository,
		private readonly checkIsPremium: (userId: string) => Promise<boolean>,
	) {}

	create = async (userId: string, data: TCreateCategory) => {
		const isPremium = await this.checkIsPremium(userId);
		if (!isPremium) {
			throw new HTTPException(403, {
				message: "PREMIUM_REQUIRED",
			});
		}

		const result = await this.repository.create(data, userId);
		await delCache(`categories:${userId}`);
		return result;
	};

	findById = async (userId: string, id: string) => {
		const cacheKey = `categories:${userId}:${id}`;
		const cached = await getCache<Category>(cacheKey);
		if (cached) return cached;

		const found = await this.repository.findById(id);

		if (!found) throw new HTTPException(404);
		if (found.userId !== null && found.userId !== userId)
			throw new HTTPException(403);

		await setCache(cacheKey, found, 600);
		return found;
	};

	findManyByUser = async (userId: string) => {
		const cacheKey = `categories:${userId}`;
		const cached = await getCache<CategoryList>(cacheKey);
		if (cached) return cached;

		const result = await this.repository.findManyByUser(userId);
		await setCache(cacheKey, result, 300);
		return result;
	};

	update = async (userId: string, id: string, data: TUpdateCategory) => {
		const found = await this.repository.findById(id);

		if (!found) throw new HTTPException(404);
		if (found.userId !== userId) throw new HTTPException(403);

		const result = await this.repository.update(id, userId, data);
		await delCache(`categories:${userId}`, `categories:${userId}:${id}`);
		return result;
	};

	delete = async (userId: string, id: string) => {
		const found = await this.repository.findById(id);

		if (!found) throw new HTTPException(404);
		if (found.userId !== userId) throw new HTTPException(403);

		const result = await this.repository.delete(id, userId);
		await delCache(`categories:${userId}`, `categories:${userId}:${id}`);
		return result;
	};
}
