"use client";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@midas/ui/components/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@midas/ui/components/chart";
import { Skeleton } from "@midas/ui/components/skeleton";
import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { CHART_COLORS, centsToBrl, type Entry } from "@/lib/finance";

function ExpensesByCategoryChart({ entries }: { entries: Entry[] }) {
	const data = useMemo(() => {
		const month = new Date().toISOString().slice(0, 7);
		const map = new Map<
			string,
			{ name: string; icon: string | null; total: number }
		>();
		for (const entry of entries.filter(
			(entry) => entry.type === "expense" && entry.date.startsWith(month),
		)) {
			const primaryCategory = entry.entryCategories[0]?.category;
			const key = primaryCategory?.id ?? "__none__";
			const categoryEntry = map.get(key) ?? {
				name: primaryCategory?.name ?? "Sem categoria",
				icon: primaryCategory?.icon ?? null,
				total: 0,
			};
			categoryEntry.total += entry.amountCents;
			map.set(key, categoryEntry);
		}
		return [...map.values()].sort((a, b) => b.total - a.total);
	}, [entries]);

	if (data.length === 0) {
		return (
			<p className="py-6 text-center text-muted-foreground text-sm">
				Sem despesas este mês.
			</p>
		);
	}

	const config = Object.fromEntries(
		data.map((category, categoryIndex) => [
			category.name,
			{
				label: category.name,
				color: CHART_COLORS[categoryIndex % CHART_COLORS.length],
			},
		]),
	) as ChartConfig;

	return (
		<div>
			<ChartContainer
				config={config}
				className="mx-auto h-[180px] w-full max-w-[220px]"
			>
				<PieChart>
					<ChartTooltip
						content={
							<ChartTooltipContent
								formatter={(value) => centsToBrl(Number(value))}
							/>
						}
					/>
					<Pie
						data={data}
						dataKey="total"
						nameKey="name"
						cx="50%"
						cy="50%"
						innerRadius={50}
						outerRadius={80}
						paddingAngle={2}
					>
						{data.map((item, categoryIndex) => (
							<Cell
								key={item.name}
								fill={CHART_COLORS[categoryIndex % CHART_COLORS.length]}
							/>
						))}
					</Pie>
				</PieChart>
			</ChartContainer>
			<ul className="mt-3 space-y-1.5">
				{data.map((item, categoryIndex) => (
					<li key={item.name} className="flex items-center gap-2">
						<span
							className="h-2.5 w-2.5 shrink-0 rounded-full"
							style={{
								background: CHART_COLORS[categoryIndex % CHART_COLORS.length],
							}}
						/>
						<span className="min-w-0 flex-1 truncate text-[13px]">
							{item.name}
						</span>
						<span className="shrink-0 font-semibold text-[13px] tabular-nums">
							{centsToBrl(item.total)}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}

export function ExpensesByCategoryCard({
	entries,
	loading,
}: {
	entries: Entry[];
	loading: boolean;
}) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="font-semibold text-sm">
						Despesas por Categoria
					</CardTitle>
					<p className="text-[11px] text-muted-foreground">Este mês</p>
				</div>
			</CardHeader>
			<CardContent>
				{loading ? (
					<Skeleton className="h-[180px] w-full rounded-lg" />
				) : (
					<ExpensesByCategoryChart entries={entries} />
				)}
			</CardContent>
		</Card>
	);
}
