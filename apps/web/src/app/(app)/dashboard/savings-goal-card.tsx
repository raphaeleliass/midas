import { Card, CardContent } from "@midas/ui/components/card";
import { Progress } from "@midas/ui/components/progress";
import { cn } from "@midas/ui/lib/utils";
import { PiggyBank } from "lucide-react";
import { centsToBrl } from "@/lib/finance";

export function SavingsGoalCard({
	monthBalance,
	savingsProgress,
	loading,
}: {
	monthBalance: number;
	savingsProgress: number;
	loading: boolean;
}) {
	return (
		<Card>
			<CardContent>
				<div className="mb-3 flex items-center justify-between gap-2">
					<div className="flex items-center gap-3">
						<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
							<PiggyBank className="h-4 w-4 text-primary" />
						</div>
						<div>
							<p className="font-medium text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
								Meta do Mês
							</p>
							<p className="font-bold text-base tabular-nums leading-tight">
								{loading ? "—" : centsToBrl(Math.abs(monthBalance))}
							</p>
						</div>
					</div>
					<span
						className={cn(
							"rounded-full px-2.5 py-1 font-semibold text-[11px]",
							monthBalance >= 0
								? "bg-primary/10 text-primary"
								: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
						)}
					>
						{Math.round(savingsProgress)}%
					</span>
				</div>
				<Progress
					value={savingsProgress}
					className={cn(
						"h-2",
						monthBalance >= 0
							? "[&_[data-slot='progress-indicator']]:bg-primary"
							: "[&_[data-slot='progress-indicator']]:bg-rose-500",
					)}
				/>
			</CardContent>
		</Card>
	);
}
