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
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

type MonthData = {
	month: string;
	income: number;
	expense: number;
};

const chartConfig = {
	income: { label: "Receitas", color: "var(--color-primary)" },
	expense: { label: "Despesas", color: "#f43f5e" },
} satisfies ChartConfig;

export function IncomeVsExpensesChart({
	data,
	loading,
}: {
	data: MonthData[];
	loading: boolean;
}) {
	const chartData = data.map((d) => ({
		month: d.month,
		income: d.income / 100,
		expense: d.expense / 100,
	}));

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="font-semibold text-sm">
						Receitas vs Despesas
					</CardTitle>
					<p className="text-[11px] text-muted-foreground">Últimos 6 meses</p>
				</div>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-1.5">
						<span className="h-2 w-2 rounded-full bg-foreground" />
						<span className="text-[11px] text-muted-foreground">Receitas</span>
					</div>
					<div className="flex items-center gap-1.5">
						<span className="h-2 w-2 rounded-full bg-rose-500" />
						<span className="text-[11px] text-muted-foreground">Despesas</span>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{loading ? (
					<Skeleton className="h-[160px] w-full rounded-lg" />
				) : (
					<ChartContainer config={chartConfig} className="h-[160px] w-full">
						<BarChart
							data={chartData}
							barCategoryGap="30%"
							barGap={2}
							margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
						>
							<CartesianGrid
								vertical={false}
								stroke="currentColor"
								strokeOpacity={0.06}
							/>
							<XAxis
								dataKey="month"
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 11, fill: "currentColor", opacity: 0.4 }}
								dy={6}
							/>
							<ChartTooltip
								content={
									<ChartTooltipContent
										formatter={(value) =>
											new Intl.NumberFormat("pt-BR", {
												style: "currency",
												currency: "BRL",
											}).format(Number(value))
										}
									/>
								}
							/>
							<Bar
								dataKey="income"
								fill="var(--color-primary)"
								radius={[3, 3, 0, 0]}
							/>
							<Bar dataKey="expense" fill="#f43f5e" radius={[3, 3, 0, 0]} />
						</BarChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}
