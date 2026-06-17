import { Skeleton } from "@midas/ui/components/skeleton";
import { centsToBrl } from "@/lib/finance";

export function KpiSummaryCards({
	totalIncome,
	totalExpense,
	netBalance,
	loading,
}: {
	totalIncome: number;
	totalExpense: number;
	netBalance: number;
	loading: boolean;
}) {
	return (
		<div className="grid grid-cols-3 gap-2">
			<div className="rounded-xl border bg-card p-3">
				<p className="text-[11px] text-muted-foreground">Receitas</p>
				{loading ? (
					<Skeleton className="mt-1 h-5 w-full" />
				) : (
					<p className="mt-0.5 font-bold text-primary text-sm tabular-nums">
						{centsToBrl(totalIncome)}
					</p>
				)}
			</div>
			<div className="rounded-xl border bg-card p-3">
				<p className="text-[11px] text-muted-foreground">Despesas</p>
				{loading ? (
					<Skeleton className="mt-1 h-5 w-full" />
				) : (
					<p className="mt-0.5 font-bold text-rose-500 text-sm tabular-nums">
						{centsToBrl(totalExpense)}
					</p>
				)}
			</div>
			<div className="rounded-xl border bg-card p-3">
				<p className="text-[11px] text-muted-foreground">Saldo</p>
				{loading ? (
					<Skeleton className="mt-1 h-5 w-full" />
				) : (
					<p
						className={`mt-0.5 font-bold text-sm tabular-nums ${
							netBalance >= 0 ? "text-primary" : "text-rose-500"
						}`}
					>
						{centsToBrl(netBalance)}
					</p>
				)}
			</div>
		</div>
	);
}
