import type { Context } from "hono";
import type { HonoVariable } from "../../HonoVariable.js";
import type { CategoriesService } from "./categories.service.js";

type AppContext = Context<HonoVariable>;

export class CategoriesController {
	constructor(private readonly service: CategoriesService) {}

	getMany = async (c: AppContext) => {
		const userId = c.get("userId") || "";
		const categories = await this.service.findManyByUser(userId);
		return c.json(categories);
	};

	getOne = async (c: AppContext) => {
		const userId = c.get("userId") || "";
		const id = c.req.param("id") || "";
		const category = await this.service.findById(userId, id);
		return c.json(category);
	};

	create = async (c: AppContext) => {
		const userId = c.get("userId") || "";
		const body = await c.req.json();
		const category = await this.service.create(userId, body);
		return c.json(category, 201);
	};

	update = async (c: AppContext) => {
		const userId = c.get("userId") || "";
		const id = c.req.param("id") || "";
		const body = await c.req.json();
		const category = await this.service.update(userId, id, body);
		return c.json(category);
	};

	delete = async (c: AppContext) => {
		const userId = c.get("userId") || "";
		const id = c.req.param("id") || "";
		await this.service.delete(userId, id);
		return c.body(null, 204);
	};
}
