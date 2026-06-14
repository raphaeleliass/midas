import { HTTPException } from "hono/http-exception";
import type { CategoriesRepository } from "./categories.repository";
import type { TCreateCategory, TUpdateCategory } from "./categories.types";

export class CategoriesService {
	constructor(private readonly repository: CategoriesRepository) {}

	create = async (userId: string, data: TCreateCategory) => {
		return this.repository.create(data, userId);
	};

	findById = async (userId: string, id: string) => {
		const found = await this.repository.findById(id);

		if (!found) throw new HTTPException(404);
		if (found.userId !== null && found.userId !== userId)
			throw new HTTPException(403);

		return found;
	};

	findManyByUser = async (userId: string) => {
		return this.repository.findManyByUser(userId);
	};

	update = async (userId: string, id: string, data: TUpdateCategory) => {
		const found = await this.repository.findById(id);

		if (!found) throw new HTTPException(404);
		if (found.userId !== userId) throw new HTTPException(403);

		return this.repository.update(id, userId, data);
	};

	delete = async (userId: string, id: string) => {
		const found = await this.repository.findById(id);

		if (!found) throw new HTTPException(404);
		if (found.userId !== userId) throw new HTTPException(403);

		return this.repository.delete(id, userId);
	};
}
