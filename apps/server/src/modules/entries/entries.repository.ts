import type { DbType } from "@midas/db";
import { entry, entryCategory } from "@midas/db";
import { desc, eq } from "drizzle-orm";
import type { TCreateEntry, TUpdateEntry } from "./entries.types";

const withCategories = {
	entryCategories: { with: { category: true as const } },
} as const;

export class EntriesRepository {
	db: DbType;

	constructor(db: DbType) {
		this.db = db;
	}

	create = async (data: TCreateEntry, userId: string) => {
		const { categoryIds, date, ...rest } = data;

		const [newEntry] = await this.db
			.insert(entry)
			.values({ userId, date: new Date(date), ...rest })
			.returning();

		if (newEntry && categoryIds?.length) {
			await this.db
				.insert(entryCategory)
				.values(categoryIds.map((categoryId) => ({ entryId: newEntry.id, categoryId })));
		}

		return newEntry ?? null;
	};

	findById = async (id: string) => {
		const found = await this.db.query.entry.findFirst({
			where: eq(entry.id, id),
			with: withCategories,
		});

		return found ?? null;
	};

	findManyByUser = async (userId: string) => {
		return this.db.query.entry.findMany({
			where: eq(entry.userId, userId),
			with: withCategories,
			orderBy: [desc(entry.date)],
		});
	};

	update = async (id: string, data: TUpdateEntry) => {
		const { categoryIds, date, ...rest } = data;

		const [updated] = await this.db
			.update(entry)
			.set({ ...rest, ...(date !== undefined && { date: new Date(date) }) })
			.where(eq(entry.id, id))
			.returning();

		if (!updated) return null;

		if (categoryIds !== undefined) {
			await this.db.delete(entryCategory).where(eq(entryCategory.entryId, id));
			if (categoryIds.length) {
				await this.db
					.insert(entryCategory)
					.values(categoryIds.map((categoryId) => ({ entryId: id, categoryId })));
			}
		}

		return updated;
	};

	delete = async (id: string) => {
		await this.db.delete(entry).where(eq(entry.id, id));
	};
}
