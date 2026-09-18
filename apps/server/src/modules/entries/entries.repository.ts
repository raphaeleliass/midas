import type { DbType } from "@midas/db";
import { category, entry, entryCategory } from "@midas/db";
import { and, asc, desc, eq, inArray, isNull, or, sql } from "drizzle-orm";
import type { TCreateEntry, TUpdateEntry } from "./entries.types";

const withCategories = {
	entryCategories: { with: { category: true as const } },
} as const;

export class EntriesRepository {
	db: DbType;

	constructor(db: DbType) {
		this.db = db;
	}

	create = async (
		data: TCreateEntry,
		userId: string,
		status: "posted" | "scheduled",
	) => {
		const { categoryIds, date, ...entryData } = data;

		const [newEntry] = await this.db
			.insert(entry)
			.values({
				userId,
				date: new Date(date),
				type: entryData.type,
				title: entryData.title,
				subtitle: entryData.subtitle,
				amountCents: entryData.amountCents,
				status,
			})
			.returning();

		if (newEntry && categoryIds?.length) {
			await this.db.insert(entryCategory).values(
				categoryIds.map((categoryId) => ({
					entryId: newEntry.id,
					categoryId,
				})),
			);
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
			where: and(eq(entry.userId, userId), eq(entry.status, "posted")),
			with: withCategories,
			orderBy: [desc(entry.date)],
		});
	};

	findManyByMonth = async (userId: string, month: string) => {
		return this.db.query.entry.findMany({
			where: and(
				eq(entry.userId, userId),
				sql`to_char(${entry.date} AT TIME ZONE 'America/Sao_Paulo', 'YYYY-MM') = ${month}`,
			),
			with: withCategories,
			orderBy: [asc(entry.date), asc(entry.createdAt)],
		});
	};

	update = async (
		id: string,
		data: TUpdateEntry,
		status: "posted" | "scheduled",
	) => {
		const { categoryIds, date, ...entryData } = data;

		const [updated] = await this.db
			.update(entry)
			.set({
				...entryData,
				...(date !== undefined && { date: new Date(date) }),
				status,
			})
			.where(eq(entry.id, id))
			.returning();

		if (!updated) return null;

		if (categoryIds !== undefined) {
			await this.db.delete(entryCategory).where(eq(entryCategory.entryId, id));
			if (categoryIds.length) {
				await this.db
					.insert(entryCategory)
					.values(
						categoryIds.map((categoryId) => ({ entryId: id, categoryId })),
					);
			}
		}

		return updated;
	};

	postDueScheduled = async (userId: string) => {
		return this.db
			.update(entry)
			.set({ status: "posted" })
			.where(
				and(
					eq(entry.userId, userId),
					eq(entry.status, "scheduled"),
					sql`(${entry.date} AT TIME ZONE 'America/Sao_Paulo')::date <= (now() AT TIME ZONE 'America/Sao_Paulo')::date`,
				),
			)
			.returning({ id: entry.id });
	};

	delete = async (id: string) => {
		await this.db.delete(entry).where(eq(entry.id, id));
	};

	countAccessibleCategories = async (userId: string, categoryIds: string[]) => {
		if (categoryIds.length === 0) return 0;
		const categories = await this.db.query.category.findMany({
			where: and(
				inArray(category.id, categoryIds),
				or(eq(category.userId, userId), isNull(category.userId)),
			),
		});
		return categories.length;
	};
}
