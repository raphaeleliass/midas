import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@midas/ui/components/card";
import { Skeleton } from "@midas/ui/components/skeleton";
import { cn } from "@midas/ui/lib/utils";
import Link from "next/link";
import { centsToBrl, type Entry, formatDate } from "@/lib/finance";
import { EntryIcon } from "../entry-icon";

export function RecentTransactionsCard({
	entries,
	loading,
	onAddEntry,
}: {
	entries: Entry[];
	loading: boolean;
	onAddEntry: () => void;
}) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="font-semibold text-sm">
						Transações Recentes
					</CardTitle>
					<Link
						href="/transactions"
						className="text-[11px] text-muted-foreground transition-colors hover:text-foreground"
					>
						Ver todas →
					</Link>
				</div>
			</CardHeader>
			<CardContent>
				{loading ? (
					<div className="divide-y">
						{[1, 2, 3].map((n) => (
							<div key={n} className="flex items-center gap-3 px-4 py-3">
								<Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
								<div className="flex-1 space-y-1.5">
									<Skeleton className="h-3.5 w-28" />
									<Skeleton className="h-3 w-20" />
								</div>
								<Skeleton className="h-3.5 w-16" />
							</div>
						))}
					</div>
				) : entries.length === 0 ? (
					<p className="px-4 py-8 text-center text-muted-foreground text-sm">
						Nenhuma transação ainda.{" "}
						<button
							type="button"
							onClick={onAddEntry}
							className="underline underline-offset-2 hover:text-foreground"
						>
							Adicione uma agora.
						</button>
					</p>
				) : (
					<ul className="divide-y">
						{entries.slice(0, 5).map((entry) => {
							const primaryCategory = entry.entryCategories[0]?.category;
							return (
								<li
									key={entry.id}
									className="flex items-center gap-3 px-4 py-3"
								>
									<EntryIcon entry={entry} />
									<div className="min-w-0 flex-1">
										<p className="truncate font-medium text-sm">
											{entry.title}
										</p>
										<p className="text-[11px] text-muted-foreground">
											{formatDate(entry.date)}
											{primaryCategory ? ` · ${primaryCategory.name}` : ""}
										</p>
									</div>
									<span
										className={cn(
											"shrink-0 font-semibold text-sm tabular-nums",
											entry.type === "income"
												? "text-primary"
												: "text-rose-500 dark:text-rose-400",
										)}
									>
										{entry.type === "income" ? "+" : "−"}
										{centsToBrl(entry.amountCents)}
									</span>
								</li>
							);
						})}
					</ul>
				)}
			</CardContent>
		</Card>
	);
}
