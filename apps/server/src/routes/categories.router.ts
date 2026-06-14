import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { db } from "@midas/db";
import type { HonoVariable } from "../HonoVariable.js";
import { CategoriesController } from "../modules/categories/categories.controller.js";
import { CategoriesRepository } from "../modules/categories/categories.repository.js";
import {
	categorySchema,
	createCategorySchema,
	updateCategorySchema,
} from "../modules/categories/categories.schema.js";
import { CategoriesService } from "../modules/categories/categories.service.js";

const idParam = z.object({ id: z.string().uuid() });

const listCategoriesRoute = createRoute({
	method: "get",
	path: "/",
	tags: ["Categories"],
	summary: "List categories for the authenticated user (includes global)",
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			content: { "application/json": { schema: z.array(categorySchema) } },
			description: "List of categories",
		},
	},
});

const getCategoryRoute = createRoute({
	method: "get",
	path: "/:id",
	tags: ["Categories"],
	summary: "Get a single category by ID",
	security: [{ bearerAuth: [] }],
	request: { params: idParam },
	responses: {
		200: {
			content: { "application/json": { schema: categorySchema } },
			description: "Category details",
		},
		403: { description: "Forbidden" },
		404: { description: "Not found" },
	},
});

const createCategoryRoute = createRoute({
	method: "post",
	path: "/",
	tags: ["Categories"],
	summary: "Create a new category",
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: { "application/json": { schema: createCategorySchema } },
		},
	},
	responses: {
		201: {
			content: { "application/json": { schema: categorySchema } },
			description: "Created category",
		},
	},
});

const updateCategoryRoute = createRoute({
	method: "patch",
	path: "/:id",
	tags: ["Categories"],
	summary: "Update a category",
	security: [{ bearerAuth: [] }],
	request: {
		params: idParam,
		body: {
			content: { "application/json": { schema: updateCategorySchema } },
		},
	},
	responses: {
		200: {
			content: { "application/json": { schema: categorySchema } },
			description: "Updated category",
		},
		403: { description: "Forbidden" },
		404: { description: "Not found" },
	},
});

const deleteCategoryRoute = createRoute({
	method: "delete",
	path: "/:id",
	tags: ["Categories"],
	summary: "Delete a category",
	security: [{ bearerAuth: [] }],
	request: { params: idParam },
	responses: {
		204: { description: "Category deleted" },
		403: { description: "Forbidden" },
		404: { description: "Not found" },
	},
});

export const categoriesRouter = new OpenAPIHono<HonoVariable>();

const repository = new CategoriesRepository(db);
const service = new CategoriesService(repository);
const controller = new CategoriesController(service);

// biome-ignore lint/suspicious/noExplicitAny: controller DI pattern incompatible with openapi v1.x strict handler types
categoriesRouter.openapi(listCategoriesRoute, controller.getMany as any);
// biome-ignore lint/suspicious/noExplicitAny: controller DI pattern incompatible with openapi v1.x strict handler types
categoriesRouter.openapi(getCategoryRoute, controller.getOne as any);
// biome-ignore lint/suspicious/noExplicitAny: controller DI pattern incompatible with openapi v1.x strict handler types
categoriesRouter.openapi(createCategoryRoute, controller.create as any);
// biome-ignore lint/suspicious/noExplicitAny: controller DI pattern incompatible with openapi v1.x strict handler types
categoriesRouter.openapi(updateCategoryRoute, controller.update as any);
// biome-ignore lint/suspicious/noExplicitAny: controller DI pattern incompatible with openapi v1.x strict handler types
categoriesRouter.openapi(deleteCategoryRoute, controller.delete as any);
