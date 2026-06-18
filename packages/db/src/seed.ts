import dotenv from "dotenv";

dotenv.config({ path: "../../apps/server/.env" });

import { neon } from "@neondatabase/serverless";
import { isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { category } from "./schema/finance";

const defaultCategories = [
	{ name: "Alimentação", icon: "UtensilsCrossed" },
	{ name: "Transporte", icon: "Bus" },
	{ name: "Saúde", icon: "HeartPulse" },
	{ name: "Moradia", icon: "Home" },
	{ name: "Educação", icon: "BookOpen" },
	{ name: "Lazer", icon: "Gamepad2" },
	{ name: "Vestuário", icon: "ShoppingCart" },
	{ name: "Serviços", icon: "Zap" },
	{ name: "Academia", icon: "Dumbbell" },
	{ name: "Salário", icon: "Briefcase" },
	{ name: "Freelance", icon: "Laptop" },
	{ name: "Investimentos", icon: "TrendingUp" },
	{ name: "Outros", icon: "Tag" },
];

async function seed() {
	const sql = neon(process.env.DATABASE_URL!);
	const db = drizzle(sql);

	const existingSystemCategories = await db
		.select()
		.from(category)
		.where(isNull(category.userId));

	if (existingSystemCategories.length > 0) {
		console.log("Default categories already seeded, skipping.");
		return;
	}

	await db.insert(category).values(defaultCategories);

	console.log(`Seeded ${defaultCategories.length} default categories.`);
}

seed().catch((error) => {
	console.error("Seed failed:", error);
	process.exit(1);
});
