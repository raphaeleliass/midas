"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { fadeUp, stagger } from "@/lib/animations";
import {
	buildPeriodSeries,
	type Entry,
	filterEntriesByPeriod,
	getPeriodLabel,
	getPreviousPeriodReference,
	type Period,
} from "@/lib/finance";
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
import { PeriodSelector } from "./period-selector";
import { ReportDownloadButton } from "./report-download-button";
import { SectionHeader } from "./section-header";
import { SpendingByWeekdayChart } from "./spending-by-weekday-chart";

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
		() => filterEntriesByPeriod(entries, period),
		[entries, period],
	);
	const previousPeriodReference = useMemo(
		() => getPreviousPeriodReference(period),
		[period],
	);
	const previousPeriodEntries = useMemo(
		() => filterEntriesByPeriod(entries, period, previousPeriodReference),
		[entries, period, previousPeriodReference],
	);
	const periodLabel = getPeriodLabel(period);
	const previousPeriodLabel = getPeriodLabel(period, previousPeriodReference);

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

	const periodExpense = periodEntries
		.filter((entry) => entry.type === "expense")
		.reduce((sum, entry) => sum + entry.amountCents, 0);
	const previousPeriodExpense = previousPeriodEntries
		.filter((entry) => entry.type === "expense")
		.reduce((sum, entry) => sum + entry.amountCents, 0);

	const maxExpense = Math.max(periodExpense, previousPeriodExpense, 1);
	const periodBarPercentage = (periodExpense / maxExpense) * 100;
	const previousPeriodBarPercentage =
		(previousPeriodExpense / maxExpense) * 100;

	const expensePercentageChange =
		previousPeriodExpense > 0
			? ((periodExpense - previousPeriodExpense) / previousPeriodExpense) * 100
			: 0;

	const previousPeriodCategoryData = useMemo(
		() => getCategoryBreakdown(previousPeriodEntries),
		[previousPeriodEntries],
	);

	const efficiencyScore =
		totalIncome > 0
			? Math.max(
					0,
					Math.min(
						100,
						Math.round(((totalIncome - periodExpense) / totalIncome) * 100),
					),
				)
			: 0;

	const topCategory = categoryData[0];

	const periodSeries = useMemo(
		() => buildPeriodSeries(entries, period),
		[entries, period],
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
					periodIncome={totalIncome}
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
				<IncomeVsExpensesChart
					data={periodSeries}
					periodLabel={periodLabel}
					loading={loading}
				/>
			</motion.div>

			<motion.div variants={fadeUp}>
				<BalanceEvolutionChart
					data={periodSeries}
					periodLabel={periodLabel}
					loading={loading}
				/>
			</motion.div>

			<motion.div variants={fadeUp}>
				<MonthlyComparisonCard
					periodLabel={periodLabel}
					previousPeriodLabel={previousPeriodLabel}
					periodExpense={periodExpense}
					previousPeriodExpense={previousPeriodExpense}
					periodBarPercentage={periodBarPercentage}
					previousPeriodBarPercentage={previousPeriodBarPercentage}
					expensePercentageChange={expensePercentageChange}
					currentPeriodCategoryData={categoryData}
					previousPeriodCategoryData={previousPeriodCategoryData}
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
