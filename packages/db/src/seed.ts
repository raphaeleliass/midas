import dotenv from "dotenv";

dotenv.config({ path: "../../apps/server/.env" });

import { neon } from "@neondatabase/serverless";
import { isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { category } from "./schema/finance";

const defaultCategories = [
	{ name: "Alimentação", icon: "UtensilsCrossed" },
	{ name: "Moradia", icon: "Home" },
	{ name: "Transporte", icon: "Bus" },
	{ name: "Saúde", icon: "HeartPulse" },
	{ name: "Educação", icon: "BookOpen" },
	{ name: "Lazer", icon: "Gamepad2" },
	{ name: "Compras", icon: "ShoppingCart" },
	{ name: "Contas e serviços", icon: "Zap" },
	{ name: "Salário", icon: "Briefcase" },
	{ name: "Investimentos", icon: "TrendingUp" },
	{ name: "Outros", icon: "Tag" },
];

async function seed() {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) throw new Error("DATABASE_URL is required");

	const sql = neon(databaseUrl);
	const db = drizzle(sql);

	const existingSystemCategories = await db
		.select()
		.from(category)
		.where(isNull(category.userId));

	const existingNames = new Set(
		existingSystemCategories.map(({ name }) => name),
	);
	const missingCategories = defaultCategories.filter(
		({ name }) => !existingNames.has(name),
	);

	if (missingCategories.length === 0) {
		console.log("All default categories already exist, skipping.");
		return;
	}

	await db.insert(category).values(missingCategories);

	console.log(`Seeded ${missingCategories.length} default categories.`);
}

seed().catch((error) => {
	console.error("Seed failed:", error);
	process.exit(1);
});
