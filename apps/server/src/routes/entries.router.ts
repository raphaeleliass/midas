import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { db } from "@midas/db";
import type { HonoVariable } from "../HonoVariable.js";
import { EntriesController } from "../modules/entries/entries.controller.js";
import { EntriesRepository } from "../modules/entries/entries.repository.js";
import {
	createEntrySchema,
	entrySchema,
	updateEntrySchema,
} from "../modules/entries/entries.schema.js";
import { EntriesService } from "../modules/entries/entries.service.js";

const idParam = z.object({ id: z.string().uuid() });

const listEntriesRoute = createRoute({
	method: "get",
	path: "/",
	tags: ["Entries"],
	summary: "List entries for the authenticated user",
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			content: { "application/json": { schema: z.array(entrySchema) } },
			description: "List of entries",
		},
	},
});

const getEntryRoute = createRoute({
	method: "get",
	path: "/:id",
	tags: ["Entries"],
	summary: "Get a single entry by ID",
	security: [{ bearerAuth: [] }],
	request: { params: idParam },
	responses: {
		200: {
			content: { "application/json": { schema: entrySchema } },
			description: "Entry details",
		},
		403: { description: "Forbidden" },
		404: { description: "Not found" },
	},
});

const createEntryRoute = createRoute({
	method: "post",
	path: "/",
	tags: ["Entries"],
	summary: "Create a new entry",
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: { "application/json": { schema: createEntrySchema } },
		},
	},
	responses: {
		201: {
			content: { "application/json": { schema: entrySchema } },
			description: "Created entry",
		},
	},
});

const updateEntryRoute = createRoute({
	method: "patch",
	path: "/:id",
	tags: ["Entries"],
	summary: "Update an entry",
	security: [{ bearerAuth: [] }],
	request: {
		params: idParam,
		body: {
			content: { "application/json": { schema: updateEntrySchema } },
		},
	},
	responses: {
		200: {
			content: { "application/json": { schema: entrySchema } },
			description: "Updated entry",
		},
		403: { description: "Forbidden" },
		404: { description: "Not found" },
	},
});

const deleteEntryRoute = createRoute({
	method: "delete",
	path: "/:id",
	tags: ["Entries"],
	summary: "Delete an entry",
	security: [{ bearerAuth: [] }],
	request: { params: idParam },
	responses: {
		204: { description: "Entry deleted" },
		403: { description: "Forbidden" },
		404: { description: "Not found" },
	},
});

export const entriesRouter = new OpenAPIHono<HonoVariable>();

const repository = new EntriesRepository(db);
const service = new EntriesService(repository);
const controller = new EntriesController(service);

// biome-ignore lint/suspicious/noExplicitAny: controller DI pattern incompatible with openapi v1.x strict handler types
entriesRouter.openapi(listEntriesRoute, controller.getMany as any);
// biome-ignore lint/suspicious/noExplicitAny: controller DI pattern incompatible with openapi v1.x strict handler types
entriesRouter.openapi(getEntryRoute, controller.getOne as any);
// biome-ignore lint/suspicious/noExplicitAny: controller DI pattern incompatible with openapi v1.x strict handler types
entriesRouter.openapi(createEntryRoute, controller.create as any);
// biome-ignore lint/suspicious/noExplicitAny: controller DI pattern incompatible with openapi v1.x strict handler types
entriesRouter.openapi(updateEntryRoute, controller.update as any);
// biome-ignore lint/suspicious/noExplicitAny: controller DI pattern incompatible with openapi v1.x strict handler types
entriesRouter.openapi(deleteEntryRoute, controller.delete as any);
