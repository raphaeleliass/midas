import type { DbType } from "@midas/db";
import { category } from "@midas/db";
import { and, eq, isNull, or } from "drizzle-orm";
import type { TCreateCategory, TUpdateCategory } from "./categories.types";

export class CategoriesRepository {
	db: DbType;

	constructor(db: DbType) {
		this.db = db;
	}

	create = async (data: TCreateCategory, userId: string) => {
		const [newCategory] = await this.db
			.insert(category)
			.values({ userId, ...data })
			.returning();

		return newCategory ?? null;
	};

	findById = async (id: string) => {
		const found = await this.db.query.category.findFirst({
			where: eq(category.id, id),
		});

		return found ?? null;
	};

	findManyByUser = async (userId: string) => {
		return this.db.query.category.findMany({
			where: or(eq(category.userId, userId), isNull(category.userId)),
			orderBy: (c, { asc }) => [asc(c.name)],
		});
	};

	update = async (id: string, userId: string, data: TUpdateCategory) => {
		const [updated] = await this.db
			.update(category)
			.set(data)
			.where(and(eq(category.id, id), eq(category.userId, userId)))
			.returning();

		return updated ?? null;
	};

	delete = async (id: string, userId: string) => {
		await this.db
			.delete(category)
			.where(and(eq(category.id, id), eq(category.userId, userId)));
	};
}
