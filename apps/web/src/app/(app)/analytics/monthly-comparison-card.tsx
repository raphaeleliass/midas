"use client";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@midas/ui/components/card";
import { Skeleton } from "@midas/ui/components/skeleton";
import { ChevronRight, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { centsToBrl } from "@/lib/finance";
import type { CategoryData } from "./expense-distribution-card";
import { SpendingIncreaseSheet } from "./spending-increase-sheet";

export function MonthlyComparisonCard({
	currentMonthExpense,
	lastMonthExpense,
	currentMonthBarPercentage,
	lastMonthBarPercentage,
	expensePercentageChange,
	currentMonthCategoryData,
	lastMonthCategoryData,
	loading,
}: {
	currentMonthExpense: number;
	lastMonthExpense: number;
	currentMonthBarPercentage: number;
	lastMonthBarPercentage: number;
	expensePercentageChange: number;
	currentMonthCategoryData: CategoryData[];
	lastMonthCategoryData: CategoryData[];
	loading: boolean;
}) {
	const [sheetOpen, setSheetOpen] = useState(false);

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className="font-semibold text-sm">
						Comparativo Mensal
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{loading ? (
						<div className="space-y-4">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
						</div>
					) : (
						<>
							<div className="space-y-1.5 rounded-xl bg-muted/50 p-4">
								<div className="flex items-end justify-between">
									<span className="text-[12px] text-muted-foreground">
										Mês atual
									</span>
									<span className="font-semibold text-sm tabular-nums">
										{centsToBrl(currentMonthExpense)}
									</span>
								</div>
								<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
									<div
										className="h-full rounded-full bg-foreground transition-all duration-500"
										style={{ width: `${currentMonthBarPercentage}%` }}
									/>
								</div>
							</div>
							<div className="space-y-1.5 rounded-xl bg-muted/50 p-4">
								<div className="flex items-end justify-between">
									<span className="text-[12px] text-muted-foreground">
										Mês anterior
									</span>
									<span className="font-semibold text-muted-foreground text-sm tabular-nums">
										{centsToBrl(lastMonthExpense)}
									</span>
								</div>
								<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
									<div
										className="h-full rounded-full bg-muted-foreground/40 transition-all duration-500"
										style={{ width: `${lastMonthBarPercentage}%` }}
									/>
								</div>
							</div>
							{lastMonthExpense > 0 && (
								<button
									type="button"
									onClick={() => setSheetOpen(true)}
									className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border bg-card p-4 text-left transition-colors hover:bg-muted/30"
								>
									<div className="flex items-center gap-3">
										<div
											className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
												expensePercentageChange > 0
													? "bg-rose-500/10"
													: "bg-primary/10"
											}`}
										>
											{expensePercentageChange > 0 ? (
												<TrendingUp className="h-5 w-5 text-rose-500" />
											) : (
												<TrendingDown className="h-5 w-5 text-primary" />
											)}
										</div>
										<div>
											<p className="font-semibold text-[13px]">
												{expensePercentageChange > 0
													? "Aumento de gastos"
													: "Redução de gastos"}
											</p>
											<p className="text-[12px] text-muted-foreground">
												{Math.abs(expensePercentageChange).toFixed(1)}%{" "}
												{expensePercentageChange > 0 ? "a mais" : "a menos"} que
												o mês passado
											</p>
										</div>
									</div>
									<ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
								</button>
							)}
						</>
					)}
				</CardContent>
			</Card>
			{lastMonthExpense > 0 && (
				<SpendingIncreaseSheet
					open={sheetOpen}
					onOpenChange={setSheetOpen}
					currentMonthExpense={currentMonthExpense}
					lastMonthExpense={lastMonthExpense}
					expensePercentageChange={expensePercentageChange}
					currentMonthCategoryData={currentMonthCategoryData}
					lastMonthCategoryData={lastMonthCategoryData}
				/>
			)}
		</>
	);
}
