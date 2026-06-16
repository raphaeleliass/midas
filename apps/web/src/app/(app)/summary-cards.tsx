import { Card, CardContent } from "@midas/ui/components/card";
import { Skeleton } from "@midas/ui/components/skeleton";
import { ArrowDown, ArrowUp } from "lucide-react";
import { centsToBrl } from "@/lib/finance";

export function SummaryCards({
	income,
	expense,
	loading,
}: {
	income: number;
	expense: number;
	loading: boolean;
}) {
	return (
		<div className="grid grid-cols-2 gap-4">
			<Card>
				<CardContent>
					<div className="mb-1 flex items-center gap-1.5">
						<ArrowUp className="h-3.5 w-3.5 text-primary" />
						<span className="text-[11px] text-muted-foreground">Receitas</span>
					</div>
					{loading ? (
						<Skeleton className="h-5 w-24" />
					) : (
						<p className="font-semibold text-primary text-sm tabular-nums">
							+{centsToBrl(income)}
						</p>
					)}
				</CardContent>
			</Card>
			<Card>
				<CardContent>
					<div className="mb-1 flex items-center gap-1.5">
						<ArrowDown className="h-3.5 w-3.5 text-rose-500" />
						<span className="text-[11px] text-muted-foreground">Despesas</span>
					</div>
					{loading ? (
						<Skeleton className="h-5 w-24" />
					) : (
						<p className="font-semibold text-rose-500 text-sm tabular-nums dark:text-rose-400">
							-{centsToBrl(expense)}
						</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
