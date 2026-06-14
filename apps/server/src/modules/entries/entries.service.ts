import { HTTPException } from "hono/http-exception";
import type { EntriesRepository } from "./entries.repository";
import type { TCreateEntry, TUpdateEntry } from "./entries.types";

export class EntriesService {
	constructor(private readonly repository: EntriesRepository) {}

	create = async (userId: string, data: TCreateEntry) => {
		return this.repository.create(data, userId);
	};

	findById = async (userId: string, id: string) => {
		const found = await this.repository.findById(id);

		if (!found) throw new HTTPException(404);
		if (found.userId !== userId) throw new HTTPException(403);

		return found;
	};

	findManyByUser = async (userId: string) => {
		return this.repository.findManyByUser(userId);
	};

	update = async (userId: string, id: string, data: TUpdateEntry) => {
		const found = await this.repository.findById(id);

		if (!found) throw new HTTPException(404);
		if (found.userId !== userId) throw new HTTPException(403);

		return this.repository.update(id, data);
	};

	delete = async (userId: string, id: string) => {
		const found = await this.repository.findById(id);

		if (!found) throw new HTTPException(404);
		if (found.userId !== userId) throw new HTTPException(403);

		return this.repository.delete(id);
	};
}
