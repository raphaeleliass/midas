import type { Context } from "hono";
import type { HonoVariable } from "../../HonoVariable.js";
import type { EntriesService } from "./entries.service.js";
import type { TCreateEntry, TUpdateEntry } from "./entries.types.js";

type AppContext = Context<HonoVariable>;

export class EntriesController {
	constructor(private readonly service: EntriesService) {}

	getMany = async (c: AppContext) => {
		const userId = c.get("userId") || "";
		const entries = await this.service.findManyByUser(userId);
		return c.json(entries);
	};

	getOne = async (c: AppContext) => {
		const userId = c.get("userId") || "";
		const id = c.req.param("id") || "";
		const entry = await this.service.findById(userId, id);
		return c.json(entry);
	};

	create = async (c: AppContext) => {
		const userId = c.var.userId;
		if (!userId) return c.json({ error: "Unauthorized" }, 401);
		const body = c.req.valid("json" as never) as TCreateEntry;
		const entry = await this.service.create(userId, body);
		return c.json(entry, 201);
	};

	update = async (c: AppContext) => {
		const userId = c.var.userId;
		if (!userId) return c.json({ error: "Unauthorized" }, 401);
		const id = (c.req.valid("param" as never) as { id: string }).id;
		const body = c.req.valid("json" as never) as TUpdateEntry;
		const entry = await this.service.update(userId, id, body);
		return c.json(entry);
	};

	delete = async (c: AppContext) => {
		const userId = c.get("userId") || "";
		const id = c.req.param("id") || "";
		await this.service.delete(userId, id);
		return c.body(null, 204);
	};
}
