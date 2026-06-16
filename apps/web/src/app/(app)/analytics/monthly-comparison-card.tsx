import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@midas/ui/components/card";
import { Skeleton } from "@midas/ui/components/skeleton";
import { TrendingDown, TrendingUp } from "lucide-react";
import { centsToBrl } from "@/lib/finance";

export function MonthlyComparisonCard({
	currentMonthExpense,
	lastMonthExpense,
	currentMonthBarPercentage,
	lastMonthBarPercentage,
	expensePercentageChange,
	loading,
}: {
	currentMonthExpense: number;
	lastMonthExpense: number;
	currentMonthBarPercentage: number;
	lastMonthBarPercentage: number;
	expensePercentageChange: number;
	loading: boolean;
}) {
	return (
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
						<div className="space-y-1.5">
							<div className="flex items-center justify-between">
								<span className="text-[12px] text-muted-foreground">
									Mês atual
								</span>
								<span className="font-semibold text-sm tabular-nums">
									{centsToBrl(currentMonthExpense)}
								</span>
							</div>
							<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
								<div
									className="h-full rounded-full bg-foreground transition-all duration-500"
									style={{ width: `${currentMonthBarPercentage}%` }}
								/>
							</div>
						</div>
						<div className="space-y-1.5">
							<div className="flex items-center justify-between">
								<span className="text-[12px] text-muted-foreground">
									Mês anterior
								</span>
								<span className="font-semibold text-sm tabular-nums">
									{centsToBrl(lastMonthExpense)}
								</span>
							</div>
							<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
								<div
									className="h-full rounded-full bg-muted-foreground/40 transition-all duration-500"
									style={{ width: `${lastMonthBarPercentage}%` }}
								/>
							</div>
						</div>
						{lastMonthExpense > 0 && (
							<div className="flex items-center gap-3 rounded-xl border p-3">
								<div
									className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
										expensePercentageChange > 0
											? "bg-rose-500/10"
											: "bg-primary/10"
									}`}
								>
									{expensePercentageChange > 0 ? (
										<TrendingUp className="h-4 w-4 text-rose-500" />
									) : (
										<TrendingDown className="h-4 w-4 text-primary" />
									)}
								</div>
								<div className="min-w-0 flex-1">
									<p className="font-medium text-[13px]">
										{expensePercentageChange > 0
											? "Aumento de gastos"
											: "Redução de gastos"}
									</p>
									<p className="text-[11px] text-muted-foreground">
										{Math.abs(expensePercentageChange).toFixed(1)}%{" "}
										{expensePercentageChange > 0 ? "a mais" : "a menos"} que o
										mês passado
									</p>
								</div>
							</div>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}
