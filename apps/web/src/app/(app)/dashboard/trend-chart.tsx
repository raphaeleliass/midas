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
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import type { Entry } from "@/lib/finance";

const chartConfig = {
	income: {
		label: "Receitas",
		color: "var(--color-primary)",
	},
	expense: {
		label: "Despesas",
		color: "#f43f5e",
	},
} satisfies ChartConfig;

function TrendChart({ entries }: { entries: Entry[] }) {
	const data = useMemo(() => {
		const today = new Date();
		return Array.from({ length: 7 }, (_, dayOffset) => {
			const date = new Date(today);
			date.setDate(today.getDate() - (6 - dayOffset));
			const dayStr = date.toISOString().split("T")[0] as string;
			const dayEntries = entries.filter((entry) =>
				entry.date.startsWith(dayStr),
			);
			const income = dayEntries
				.filter((entry) => entry.type === "income")
				.reduce((sum, entry) => sum + entry.amountCents, 0);
			const expense = dayEntries
				.filter((entry) => entry.type === "expense")
				.reduce((sum, entry) => sum + entry.amountCents, 0);
			return {
				day: date
					.toLocaleDateString("pt-BR", { weekday: "short" })
					.replace(".", ""),
				income: income / 100,
				expense: expense / 100,
			};
		});
	}, [entries]);

	return (
		<ChartContainer config={chartConfig} className="h-[140px] w-full">
			<AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
				<defs>
					<linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
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
					<linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#f43f5e" stopOpacity={0.18} />
						<stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
					</linearGradient>
				</defs>
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
				<Area
					type="monotone"
					dataKey="income"
					stroke="var(--color-primary)"
					strokeWidth={1.5}
					fill="url(#incomeGrad)"
					dot={false}
					activeDot={{ r: 3, fill: "var(--color-primary)" }}
				/>
				<Area
					type="monotone"
					dataKey="expense"
					stroke="#f43f5e"
					strokeWidth={1.5}
					fill="url(#expenseGrad)"
					dot={false}
					activeDot={{ r: 3, fill: "#f43f5e" }}
				/>
			</AreaChart>
		</ChartContainer>
	);
}

export function TrendCard({
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
					<CardTitle className="font-semibold text-sm">Tendências</CardTitle>
					<p className="text-[11px] text-muted-foreground">Últimos 7 dias</p>
				</div>
			</CardHeader>
			<CardContent>
				{loading ? (
					<Skeleton className="h-[140px] w-full rounded-lg" />
				) : (
					<TrendChart entries={entries} />
				)}
			</CardContent>
		</Card>
	);
}
