"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fadeUp, stagger } from "@/lib/animations";
import type { authClient } from "@/lib/auth-client";
import { BASE, type Entry } from "@/lib/finance";
import { AppHeader } from "../app-header";
import { EfficiencyScoreCard } from "./efficiency-score-card";
import type { CategoryData } from "./expense-distribution-card";
import { ExpenseDistributionCard } from "./expense-distribution-card";
import { MonthlyComparisonCard } from "./monthly-comparison-card";
import { type Period, PeriodSelector } from "./period-selector";

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

export default function Analytics({
	session: _session,
}: {
	session: typeof authClient.$Infer.Session;
}) {
	const [entries, setEntries] = useState<Entry[]>([]);
	const [loading, setLoading] = useState(true);
	const [period, setPeriod] = useState<Period>("month");

	const loadData = useCallback(async () => {
		setLoading(true);
		const res = await fetch(`${BASE}/entries`, { credentials: "include" });
		if (res.ok) setEntries(await res.json());
		setLoading(false);
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

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

	return (
		<motion.div
			variants={stagger}
			initial="hidden"
			animate="show"
			className="mx-auto max-w-2xl space-y-4 px-4 pt-4 pb-28 md:px-6 md:pt-6"
		>
			<AppHeader title="Finance" />

			<motion.div variants={fadeUp} className="space-y-3">
				<h1 className="font-bold text-2xl tracking-tight">Analytics</h1>
				<PeriodSelector period={period} onChange={setPeriod} />
			</motion.div>

			<motion.div variants={fadeUp}>
				<ExpenseDistributionCard
					categoryData={categoryData}
					totalExpense={totalExpense}
					loading={loading}
				/>
			</motion.div>

			<motion.div variants={fadeUp}>
				<MonthlyComparisonCard
					currentMonthExpense={currentMonthExpense}
					lastMonthExpense={lastMonthExpense}
					currentMonthBarPercentage={currentMonthBarPercentage}
					lastMonthBarPercentage={lastMonthBarPercentage}
					expensePercentageChange={expensePercentageChange}
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
		</motion.div>
	);
}
