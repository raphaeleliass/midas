import assert from "node:assert/strict";
import { HTTPException } from "hono/http-exception";
import type { EntriesRepository } from "./entries.repository.js";
import { EntriesService } from "./entries.service.js";

const entry = {
	id: "00000000-0000-0000-0000-000000000001",
	userId: "user-1",
	type: "expense" as const,
	title: "Test",
	subtitle: null,
	amountCents: 100,
	date: new Date(),
	createdAt: new Date(),
	updatedAt: new Date(),
	entryCategories: [],
};

let created = false;
const repository = {
	countAccessibleCategories: async (_userId: string, categoryIds: string[]) =>
		categoryIds.includes("foreign-category") ? 0 : categoryIds.length,
	create: async () => {
		created = true;
		return entry;
	},
} as unknown as EntriesRepository;

const service = new EntriesService(repository);

await assert.rejects(
	service.create("user-1", {
		type: "expense",
		title: "Test",
		amountCents: 100,
		date: "2026-09-02T00:00:00.000Z",
		categoryIds: ["foreign-category"],
	}),
	(error: unknown) => error instanceof HTTPException && error.status === 422,
);
assert.equal(created, false);

await service.create("user-1", {
	type: "expense",
	title: "Test",
	amountCents: 100,
	date: "2026-09-02T00:00:00.000Z",
	categoryIds: ["owned-category"],
});
assert.equal(created, true);
