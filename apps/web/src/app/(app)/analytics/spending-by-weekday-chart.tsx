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

type WeekdayData = { day: string; total: number };

const chartConfig = {
	total: { label: "Gastos", color: "#f43f5e" },
} satisfies ChartConfig;

export function SpendingByWeekdayChart({
	data,
	loading,
}: {
	data: WeekdayData[];
	loading: boolean;
}) {
	const chartData = data.map((d) => ({ day: d.day, total: d.total / 100 }));

	return (
		<Card>
			<CardHeader>
				<CardTitle className="font-semibold text-sm">
					Gastos por Dia da Semana
				</CardTitle>
			</CardHeader>
			<CardContent>
				{loading ? (
					<Skeleton className="h-[140px] w-full rounded-lg" />
				) : (
					<ChartContainer config={chartConfig} className="h-[140px] w-full">
						<BarChart
							data={chartData}
							barCategoryGap="35%"
							margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
						>
							<CartesianGrid
								vertical={false}
								stroke="currentColor"
								strokeOpacity={0.06}
							/>
							<XAxis
								dataKey="day"
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
							<Bar dataKey="total" fill="#f43f5e" radius={[3, 3, 0, 0]} />
						</BarChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}
