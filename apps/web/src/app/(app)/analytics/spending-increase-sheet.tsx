"use client";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@midas/ui/components/popover";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@midas/ui/components/sheet";
import { Info, TrendingDown, TrendingUp } from "lucide-react";
import { CategoryIcon } from "@/lib/category-icons";
import { centsToBrl } from "@/lib/finance";
import type { CategoryData } from "./expense-distribution-card";

type CategoryDelta = {
	name: string;
	icon: string | null;
	color: string | null;
	currentMonth: number;
	lastMonth: number;
	delta: number;
};

function mergeCategoryDeltas(
	current: CategoryData[],
	last: CategoryData[],
): CategoryDelta[] {
	const allNames = new Set([
		...current.map((c) => c.name),
		...last.map((c) => c.name),
	]);

	return [...allNames]
		.map((name) => {
			const currentEntry = current.find((c) => c.name === name);
			const lastEntry = last.find((c) => c.name === name);
			return {
				name,
				icon: currentEntry?.icon ?? lastEntry?.icon ?? null,
				color: currentEntry?.color ?? lastEntry?.color ?? null,
				currentMonth: currentEntry?.total ?? 0,
				lastMonth: lastEntry?.total ?? 0,
				delta: (currentEntry?.total ?? 0) - (lastEntry?.total ?? 0),
			};
		})
		.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
}

export function SpendingIncreaseSheet({
	open,
	onOpenChange,
	currentMonthCategoryData,
	lastMonthCategoryData,
	currentMonthExpense,
	lastMonthExpense,
	expensePercentageChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentMonthCategoryData: CategoryData[];
	lastMonthCategoryData: CategoryData[];
	currentMonthExpense: number;
	lastMonthExpense: number;
	expensePercentageChange: number;
}) {
	const isIncrease = expensePercentageChange > 0;
	const totalDelta = currentMonthExpense - lastMonthExpense;
	const deltas = mergeCategoryDeltas(
		currentMonthCategoryData,
		lastMonthCategoryData,
	);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="bottom"
				className="max-h-[85dvh] overflow-y-auto rounded-t-2xl"
			>
				<SheetHeader className="px-6 pt-6 pb-4">
					<div className="flex items-center gap-3">
						<div
							className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
								isIncrease ? "bg-rose-500/10" : "bg-primary/10"
							}`}
						>
							{isIncrease ? (
								<TrendingUp className="h-5 w-5 text-rose-500" />
							) : (
								<TrendingDown className="h-5 w-5 text-primary" />
							)}
						</div>
						<div>
							<SheetTitle className="text-base">
								{isIncrease ? "Aumento de Gastos" : "Redução de Gastos"}
							</SheetTitle>
							<p className="text-[12px] text-muted-foreground">
								{Math.abs(expensePercentageChange).toFixed(1)}%{" "}
								{isIncrease ? "a mais" : "a menos"} que o mês passado
							</p>
						</div>
					</div>
				</SheetHeader>

				<div className="mx-6 mb-5 flex items-center justify-between rounded-xl bg-muted/50 p-4">
					<div>
						<p className="text-[11px] text-muted-foreground">Mês passado</p>
						<p className="font-semibold text-sm tabular-nums">
							{centsToBrl(lastMonthExpense)}
						</p>
					</div>
					<div className="text-center">
						<div className="flex items-center justify-center gap-1">
							<p className="text-[11px] text-muted-foreground">variação</p>
							<Popover>
								<PopoverTrigger
									aria-label="O que é variação?"
									className="text-muted-foreground/50 transition-colors hover:text-muted-foreground"
								>
									<Info className="h-3 w-3" />
								</PopoverTrigger>
								<PopoverContent side="top" className="max-w-60 text-sm">
									<p className="font-semibold text-[13px]">Variação</p>
									<p className="mt-1.5 text-[12px] text-muted-foreground leading-relaxed">
										Diferença em reais entre o total gasto este mês e o total do
										mês passado. Um valor positivo significa que você gastou
										mais; negativo, que você gastou menos.
									</p>
								</PopoverContent>
							</Popover>
						</div>
						<p
							className={`font-bold text-sm tabular-nums ${
								isIncrease ? "text-rose-500" : "text-primary"
							}`}
						>
							{totalDelta > 0 ? "+" : ""}
							{centsToBrl(totalDelta)}
						</p>
					</div>
					<div className="text-right">
						<p className="text-[11px] text-muted-foreground">Mês atual</p>
						<p className="font-semibold text-sm tabular-nums">
							{centsToBrl(currentMonthExpense)}
						</p>
					</div>
				</div>

				<div className="space-y-2 px-6 pb-8">
					<p className="mb-3 font-semibold text-[11px] text-muted-foreground uppercase tracking-[0.1em]">
						Por categoria
					</p>
					{deltas.map((item) => {
						const deltaPercentage =
							item.lastMonth > 0 ? (item.delta / item.lastMonth) * 100 : null;
						const isPositiveDelta = item.delta > 0;

						return (
							<div
								key={item.name}
								className="flex items-center gap-3 rounded-xl border p-3"
							>
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
									<CategoryIcon
										iconKey={item.icon}
										className="h-4 w-4 text-muted-foreground"
									/>
								</div>
								<div className="min-w-0 flex-1">
									<p className="font-medium text-[13px]">{item.name}</p>
									<p className="text-[11px] text-muted-foreground tabular-nums">
										{centsToBrl(item.lastMonth)} →{" "}
										{centsToBrl(item.currentMonth)}
									</p>
								</div>
								<div className="text-right">
									<p
										className={`font-semibold text-[13px] tabular-nums ${
											isPositiveDelta
												? "text-rose-500"
												: item.delta < 0
													? "text-primary"
													: "text-muted-foreground"
										}`}
									>
										{isPositiveDelta ? "+" : ""}
										{centsToBrl(item.delta)}
									</p>
									{deltaPercentage !== null && (
										<p className="text-[11px] text-muted-foreground">
											{deltaPercentage > 0 ? "+" : ""}
											{deltaPercentage.toFixed(0)}%
										</p>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</SheetContent>
		</Sheet>
	);
}
