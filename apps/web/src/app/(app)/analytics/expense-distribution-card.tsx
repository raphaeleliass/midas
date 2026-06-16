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
import { CHART_COLORS, centsToBrl } from "@/lib/finance";

type CategoryData = {
	name: string;
	icon: string | null;
	total: number;
	color: string | null;
};

export function ExpenseDistributionCard({
	categoryData,
	totalExpense,
	loading,
}: {
	categoryData: CategoryData[];
	totalExpense: number;
	loading: boolean;
}) {
	const chartConfig = useMemo(
		() =>
			Object.fromEntries(
				categoryData.map((category, categoryIndex) => [
					category.name,
					{
						label: category.name,
						color: CHART_COLORS[categoryIndex % CHART_COLORS.length],
					},
				]),
			) as ChartConfig,
		[categoryData],
	);

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="font-semibold text-sm">
						Distribuição de Despesas
					</CardTitle>
					{loading ? (
						<Skeleton className="h-4 w-20" />
					) : (
						<span className="font-semibold text-sm tabular-nums">
							{centsToBrl(totalExpense)}
						</span>
					)}
				</div>
			</CardHeader>
			<CardContent>
				{loading ? (
					<div className="space-y-4">
						<Skeleton className="mx-auto h-[180px] w-[180px] rounded-full" />
						<div className="grid grid-cols-2 gap-2">
							{[1, 2, 3, 4].map((n) => (
								<Skeleton key={n} className="h-14 rounded-lg" />
							))}
						</div>
					</div>
				) : categoryData.length === 0 ? (
					<p className="py-8 text-center text-muted-foreground text-sm">
						Sem despesas neste período.
					</p>
				) : (
					<div>
						<div className="relative">
							<ChartContainer
								config={chartConfig}
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
										data={categoryData}
										dataKey="total"
										nameKey="name"
										cx="50%"
										cy="50%"
										innerRadius={55}
										outerRadius={85}
										paddingAngle={2}
									>
										{categoryData.map((item, categoryIndex) => (
											<Cell
												key={item.name}
												fill={CHART_COLORS[categoryIndex % CHART_COLORS.length]}
											/>
										))}
									</Pie>
								</PieChart>
							</ChartContainer>
							<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
								<p className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
									Total
								</p>
								<p className="font-bold text-base tabular-nums">
									{centsToBrl(totalExpense)}
								</p>
							</div>
						</div>
						<div className="mt-4 grid grid-cols-2 gap-2">
							{categoryData.slice(0, 4).map((item, categoryIndex) => (
								<div
									key={item.name}
									className="flex items-center gap-2 rounded-lg border p-2.5"
								>
									<span
										className="h-2 w-2 shrink-0 rounded-full"
										style={{
											background:
												CHART_COLORS[categoryIndex % CHART_COLORS.length],
										}}
									/>
									<div className="min-w-0 flex-1">
										<p className="truncate text-[11px] text-muted-foreground">
											{item.name}
										</p>
										<p className="font-semibold text-[12px] tabular-nums">
											{centsToBrl(item.total)}
										</p>
									</div>
								</div>
							))}
							{categoryData.length > 4 && (
								<div className="col-span-2 text-center text-[11px] text-muted-foreground">
									+{categoryData.length - 4} categorias
								</div>
							)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export type { CategoryData };
