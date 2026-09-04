export const BASE = "";
export const FINANCE_TIME_ZONE = "America/Sao_Paulo";

export type Period = "week" | "month" | "year";

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

export type MonthlyGoals = {
	expenseTargetCents: number | null;
	incomeTargetCents: number | null;
};

export type PeriodData = {
	label: string;
	income: number;
	expense: number;
};

function formatDatePart(date: Date, options: Intl.DateTimeFormatOptions) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: FINANCE_TIME_ZONE,
		...options,
	}).format(date);
}

function dateFromKey(key: string) {
	return new Date(`${key}T12:00:00Z`);
}

function keyFromUtcDate(date: Date) {
	return date.toISOString().slice(0, 10);
}

function addDays(key: string, days: number) {
	const date = dateFromKey(key);
	date.setUTCDate(date.getUTCDate() + days);
	return keyFromUtcDate(date);
}

export function getDateKey(value: string | Date) {
	return formatDatePart(new Date(value), {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
}

export function getMonthKey(value: string | Date = new Date()) {
	return formatDatePart(new Date(value), {
		year: "numeric",
		month: "2-digit",
	});
}

export function getTodayInput() {
	return getDateKey(new Date());
}

export function getCalendarDateInput(date: Date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function dateInputToIso(value: string) {
	return new Date(`${value}T12:00:00-03:00`).toISOString();
}

export function formatMonth(key: string) {
	return dateFromKey(`${key}-01`).toLocaleDateString("pt-BR", {
		timeZone: "UTC",
		month: "long",
		year: "numeric",
	});
}

export function getPeriodLabel(period: Period, reference = new Date()) {
	if (period === "week") return "Últimos 7 dias";
	if (period === "year") return `Ano de ${getDateKey(reference).slice(0, 4)}`;
	return formatMonth(getMonthKey(reference));
}

function getPeriodBounds(period: Period, reference = new Date()) {
	const today = getDateKey(reference);
	if (period === "week") return { start: addDays(today, -6), end: today };
	if (period === "year") {
		const year = today.slice(0, 4);
		return { start: `${year}-01-01`, end: `${year}-12-31` };
	}
	const month = getMonthKey(reference);
	const end = new Date(`${month}-01T12:00:00Z`);
	end.setUTCMonth(end.getUTCMonth() + 1);
	end.setUTCDate(0);
	return { start: `${month}-01`, end: keyFromUtcDate(end) };
}

export function filterEntriesByPeriod<T extends { date: string }>(
	entries: T[],
	period: Period,
	reference = new Date(),
) {
	const { start, end } = getPeriodBounds(period, reference);
	return entries.filter((entry) => {
		const date = getDateKey(entry.date);
		return date >= start && date <= end;
	});
}

export function getPreviousPeriodReference(
	period: Period,
	reference = new Date(),
) {
	const date = dateFromKey(getDateKey(reference));
	if (period === "week") date.setUTCDate(date.getUTCDate() - 7);
	if (period === "month") date.setUTCMonth(date.getUTCMonth() - 1);
	if (period === "year") date.setUTCFullYear(date.getUTCFullYear() - 1);
	return date;
}

export function buildPeriodSeries(
	entries: Entry[],
	period: Period,
): PeriodData[] {
	const reference = new Date();
	if (period === "year") {
		const year = getDateKey(reference).slice(0, 4);
		return Array.from({ length: 12 }, (_, index) => {
			const month = `${year}-${String(index + 1).padStart(2, "0")}`;
			return summarizeEntries(
				entries.filter((entry) => getMonthKey(entry.date) === month),
				formatMonth(month).replace(/ de \d{4}/, ""),
			);
		});
	}

	const { start, end } = getPeriodBounds(period, reference);
	const starts =
		period === "week"
			? Array.from({ length: 7 }, (_, index) => addDays(start, index))
			: [0, 7, 14, 21, 28]
					.map((offset) => addDays(start, offset))
					.filter((key) => key <= end);
	return starts.map((bucketStart) => {
		const bucketEnd =
			period === "week"
				? bucketStart
				: [addDays(bucketStart, 6), end].sort()[0];
		const label =
			period === "week"
				? dateFromKey(bucketStart)
						.toLocaleDateString("pt-BR", {
							timeZone: "UTC",
							weekday: "short",
						})
						.replace(".", "")
				: `${bucketStart.slice(-2)}–${bucketEnd.slice(-2)}`;
		return summarizeEntries(
			entries.filter((entry) => {
				const key = getDateKey(entry.date);
				return key >= bucketStart && key <= bucketEnd;
			}),
			label,
		);
	});
}

function summarizeEntries(entries: Entry[], label: string): PeriodData {
	return {
		label,
		income: entries
			.filter((entry) => entry.type === "income")
			.reduce((sum, entry) => sum + entry.amountCents, 0),
		expense: entries
			.filter((entry) => entry.type === "expense")
			.reduce((sum, entry) => sum + entry.amountCents, 0),
	};
}

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
		timeZone: FINANCE_TIME_ZONE,
		day: "2-digit",
		month: "short",
	});
}
