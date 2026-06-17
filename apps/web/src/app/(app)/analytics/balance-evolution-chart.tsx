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
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis } from "recharts";

type MonthData = {
	month: string;
	income: number;
	expense: number;
};

const chartConfig = {
	balance: { label: "Saldo", color: "var(--color-primary)" },
} satisfies ChartConfig;

export function BalanceEvolutionChart({
	data,
	loading,
}: {
	data: MonthData[];
	loading: boolean;
}) {
	const chartData = data.map((d) => ({
		month: d.month,
		balance: (d.income - d.expense) / 100,
	}));

	const hasNegative = chartData.some((d) => d.balance < 0);

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="font-semibold text-sm">
						Evolução do Saldo
					</CardTitle>
					<p className="text-[11px] text-muted-foreground">Últimos 6 meses</p>
				</div>
			</CardHeader>
			<CardContent>
				{loading ? (
					<Skeleton className="h-[160px] w-full rounded-lg" />
				) : (
					<ChartContainer config={chartConfig} className="h-[160px] w-full">
						<AreaChart
							data={chartData}
							margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
						>
							<defs>
								<linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
									<stop
										offset="0%"
										stopColor="var(--color-primary)"
										stopOpacity={0.18}
									/>
									<stop
										offset="100%"
										stopColor="var(--color-primary)"
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>
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
							{hasNegative && (
								<ReferenceLine
									y={0}
									stroke="currentColor"
									strokeOpacity={0.2}
									strokeDasharray="3 3"
								/>
							)}
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
							<Area
								type="monotone"
								dataKey="balance"
								stroke="var(--color-primary)"
								strokeWidth={1.5}
								fill="url(#balanceGrad)"
								dot={false}
								activeDot={{ r: 3, fill: "var(--color-primary)" }}
							/>
						</AreaChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}
