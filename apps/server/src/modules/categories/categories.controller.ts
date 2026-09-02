import type { Context } from "hono";
import type { HonoVariable } from "../../HonoVariable.js";
import type { CategoriesService } from "./categories.service.js";
import type { TCreateCategory, TUpdateCategory } from "./categories.types.js";

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
		const userId = c.var.userId;
		if (!userId) return c.json({ error: "Unauthorized" }, 401);
		const body = c.req.valid("json" as never) as TCreateCategory;
		const category = await this.service.create(userId, body);
		return c.json(category, 201);
	};

	update = async (c: AppContext) => {
		const userId = c.var.userId;
		if (!userId) return c.json({ error: "Unauthorized" }, 401);
		const id = (c.req.valid("param" as never) as { id: string }).id;
		const body = c.req.valid("json" as never) as TUpdateCategory;
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
