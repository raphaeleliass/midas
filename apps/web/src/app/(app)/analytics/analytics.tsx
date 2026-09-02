"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { fadeUp, stagger } from "@/lib/animations";
import type { Entry } from "@/lib/finance";
import { useFirstVisit } from "@/lib/hooks/use-first-visit";
import { useEntries } from "@/lib/queries";
import { AppHeader } from "../app-header";
import { BalanceEvolutionChart } from "./balance-evolution-chart";
import { EfficiencyScoreCard } from "./efficiency-score-card";
import type { CategoryData } from "./expense-distribution-card";
import { ExpenseDistributionCard } from "./expense-distribution-card";
import { IncomeVsExpensesChart } from "./income-vs-expenses-chart";
import { KpiSummaryCards } from "./kpi-summary-cards";
import { MonthlyComparisonCard } from "./monthly-comparison-card";
import { type Period, PeriodSelector } from "./period-selector";
import { SectionHeader } from "./section-header";
import { ReportDownloadButton } from "./report-download-button";
import { SpendingByWeekdayChart } from "./spending-by-weekday-chart";

function filterByPeriod(entries: Entry[], period: Period): Entry[] {
	const now = new Date();
	if (period === "week") {
		const cutoff = new Date(now);
		cutoff.setDate(now.getDate() - 7);
		return entries.filter((entry) => new Date(entry.date) >= cutoff);
	}
	if (period === "month") {
		const prefix = now.toISOString().slice(0, 7);
		return entries.filter((entry) => entry.date.startsWith(prefix));
	}
	const yearPrefix = now.getFullYear().toString();
	return entries.filter((entry) => entry.date.startsWith(yearPrefix));
}

function getCategoryBreakdown(entries: Entry[]): CategoryData[] {
	const map = new Map<
		string,
		{ name: string; icon: string | null; total: number; color: string | null }
	>();
	for (const entry of entries.filter((entry) => entry.type === "expense")) {
		const primaryCategory = entry.entryCategories[0]?.category;
		const key = primaryCategory?.id ?? "__none__";
		const categoryEntry = map.get(key) ?? {
			name: primaryCategory?.name ?? "Sem categoria",
			icon: primaryCategory?.icon ?? null,
			total: 0,
			color: primaryCategory?.color ?? null,
		};
		categoryEntry.total += entry.amountCents;
		map.set(key, categoryEntry);
	}
	return [...map.values()].sort((a, b) => b.total - a.total);
}

export default function Analytics() {
	const isFirstVisit = useFirstVisit("analytics");
	const { data: entries = [], isLoading: loading } = useEntries();
	const [period, setPeriod] = useState<Period>("month");

	const periodEntries = useMemo(
		() => filterByPeriod(entries, period),
		[entries, period],
	);

	const categoryData = useMemo(
		() => getCategoryBreakdown(periodEntries),
		[periodEntries],
	);

	const totalExpense = categoryData.reduce(
		(sum, category) => sum + category.total,
		0,
	);

	const totalIncome = useMemo(
		() =>
			periodEntries
				.filter((e) => e.type === "income")
				.reduce((sum, e) => sum + e.amountCents, 0),
		[periodEntries],
	);

	const netBalance = totalIncome - totalExpense;

	const currentMonthPrefix = new Date().toISOString().slice(0, 7);
	const lastMonthDate = new Date();
	lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
	const lastMonthPrefix = lastMonthDate.toISOString().slice(0, 7);

	const currentMonthExpense = entries
		.filter(
			(entry) =>
				entry.type === "expense" && entry.date.startsWith(currentMonthPrefix),
		)
		.reduce((sum, entry) => sum + entry.amountCents, 0);

	const lastMonthExpense = entries
		.filter(
			(entry) =>
				entry.type === "expense" && entry.date.startsWith(lastMonthPrefix),
		)
		.reduce((sum, entry) => sum + entry.amountCents, 0);

	const maxExpense = Math.max(currentMonthExpense, lastMonthExpense, 1);
	const currentMonthBarPercentage = (currentMonthExpense / maxExpense) * 100;
	const lastMonthBarPercentage = (lastMonthExpense / maxExpense) * 100;

	const expensePercentageChange =
		lastMonthExpense > 0
			? ((currentMonthExpense - lastMonthExpense) / lastMonthExpense) * 100
			: 0;

	const currentMonthCategoryData = useMemo(
		() =>
			getCategoryBreakdown(
				entries.filter((e) => e.date.startsWith(currentMonthPrefix)),
			),
		[entries, currentMonthPrefix],
	);

	const lastMonthCategoryData = useMemo(
		() =>
			getCategoryBreakdown(
				entries.filter((e) => e.date.startsWith(lastMonthPrefix)),
			),
		[entries, lastMonthPrefix],
	);

	const monthIncome = entries
		.filter(
			(entry) =>
				entry.type === "income" && entry.date.startsWith(currentMonthPrefix),
		)
		.reduce((sum, entry) => sum + entry.amountCents, 0);

	const efficiencyScore =
		monthIncome > 0
			? Math.max(
					0,
					Math.min(
						100,
						Math.round(
							((monthIncome - currentMonthExpense) / monthIncome) * 100,
						),
					),
				)
			: 0;

	const topCategory = categoryData[0];

	const last6MonthsData = useMemo(
		() =>
			Array.from({ length: 6 }, (_, i) => {
				const date = new Date();
				date.setMonth(date.getMonth() - (5 - i));
				const prefix = date.toISOString().slice(0, 7);
				const monthEntries = entries.filter((e) => e.date.startsWith(prefix));
				return {
					month: date
						.toLocaleString("pt-BR", { month: "short" })
						.replace(".", ""),
					income: monthEntries
						.filter((e) => e.type === "income")
						.reduce((s, e) => s + e.amountCents, 0),
					expense: monthEntries
						.filter((e) => e.type === "expense")
						.reduce((s, e) => s + e.amountCents, 0),
				};
			}),
		[entries],
	);

	const spendingByWeekday = useMemo(() => {
		const labels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
		const totals = new Array(7).fill(0) as number[];
		for (const entry of periodEntries.filter((e) => e.type === "expense")) {
			totals[new Date(`${entry.date}T12:00:00`).getDay()] += entry.amountCents;
		}
		return labels.map((day, i) => ({ day, total: totals[i] ?? 0 }));
	}, [periodEntries]);

	return (
		<motion.div
			variants={stagger}
			initial={isFirstVisit ? "hidden" : "show"}
			animate="show"
			className="mx-auto max-w-2xl space-y-4 px-4 pt-4 pb-28 md:px-6 md:pt-6"
		>
			<AppHeader title="Finance" />

			<motion.div variants={fadeUp} className="space-y-3">
				<h1 className="font-bold text-2xl tracking-tight">Analytics</h1>
				<PeriodSelector period={period} onChange={setPeriod} />
			</motion.div>

			{/* ── Resumo ── */}
			<motion.div variants={fadeUp}>
				<SectionHeader label="Resumo" />
			</motion.div>

			<motion.div variants={fadeUp}>
				<KpiSummaryCards
					totalIncome={totalIncome}
					totalExpense={totalExpense}
					netBalance={netBalance}
					loading={loading}
				/>
			</motion.div>

			<motion.div variants={fadeUp}>
				<EfficiencyScoreCard
					efficiencyScore={efficiencyScore}
					topCategory={topCategory}
					monthIncome={monthIncome}
					loading={loading}
				/>
			</motion.div>

			{/* ── Análise Detalhada ── */}
			<motion.div variants={fadeUp}>
				<SectionHeader label="Análise Detalhada" />
			</motion.div>

			<motion.div variants={fadeUp}>
				<ExpenseDistributionCard
					categoryData={categoryData}
					totalExpense={totalExpense}
					loading={loading}
				/>
			</motion.div>

			<motion.div variants={fadeUp}>
				<IncomeVsExpensesChart data={last6MonthsData} loading={loading} />
			</motion.div>

			<motion.div variants={fadeUp}>
				<BalanceEvolutionChart data={last6MonthsData} loading={loading} />
			</motion.div>

			<motion.div variants={fadeUp}>
				<MonthlyComparisonCard
					currentMonthExpense={currentMonthExpense}
					lastMonthExpense={lastMonthExpense}
					currentMonthBarPercentage={currentMonthBarPercentage}
					lastMonthBarPercentage={lastMonthBarPercentage}
					expensePercentageChange={expensePercentageChange}
					currentMonthCategoryData={currentMonthCategoryData}
					lastMonthCategoryData={lastMonthCategoryData}
					loading={loading}
				/>
			</motion.div>

			<motion.div variants={fadeUp}>
				<SpendingByWeekdayChart data={spendingByWeekday} loading={loading} />
			</motion.div>

			<motion.div variants={fadeUp}>
				<ReportDownloadButton entries={entries} period={period} />
			</motion.div>
		</motion.div>
	);
}
