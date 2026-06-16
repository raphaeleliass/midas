import { env } from "@midas/env/web";

export const BASE = env.NEXT_PUBLIC_SERVER_URL;

export const CHART_COLORS = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)",
	"var(--chart-4)",
	"var(--chart-5)",
];

export type Category = {
	id: string;
	name: string;
	icon: string | null;
	color: string | null;
	userId: string | null;
};

export type Entry = {
	id: string;
	type: "expense" | "income";
	title: string;
	subtitle: string | null;
	amountCents: number;
	date: string;
	entryCategories: {
		entryId: string;
		categoryId: string;
		category: Category;
	}[];
};

export function centsToBrl(cents: number) {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(cents / 100);
}

export function brlToCents(value: string) {
	return Math.round(Number.parseFloat(value.replace(",", ".")) * 100);
}

export function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "short",
	});
}
