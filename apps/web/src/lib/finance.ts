export const BASE = "";

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
	const normalized = value.replace(/\./g, "").replace(",", ".");
	return Math.round(Number.parseFloat(normalized) * 100);
}

export function applyAmountMask(input: string): string {
	const digits = input.replace(/\D/g, "");
	if (!digits) return "";
	return new Intl.NumberFormat("pt-BR", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(Number.parseInt(digits, 10) / 100);
}

export function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "short",
	});
}
