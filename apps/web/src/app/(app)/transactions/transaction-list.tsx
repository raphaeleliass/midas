"use client";

import { Card, CardContent } from "@midas/ui/components/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@midas/ui/components/dropdown-menu";
import { Skeleton } from "@midas/ui/components/skeleton";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@midas/ui/components/tabs";
import { cn } from "@midas/ui/lib/utils";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { centsToBrl, type Entry, formatDate } from "@/lib/finance";
import { EntryIcon } from "../entry-icon";

function formatDayHeader(iso: string) {
	const date = new Date(`${iso}T12:00:00`);
	const today = new Date();
	const todayStr = today.toISOString().slice(0, 10);
	if (iso === todayStr) return "Hoje";
	const yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);
	if (iso === yesterday.toISOString().slice(0, 10)) return "Ontem";
	return date.toLocaleDateString("pt-BR", {
		weekday: "long",
		day: "2-digit",
		month: "short",
	});
}

export function TransactionList({
	entries,
	loading,
	onAddEntry,
	onEdit,
	onDelete,
}: {
	entries: Entry[];
	loading: boolean;
	onAddEntry: () => void;
	onEdit: (entry: Entry) => void;
	onDelete: (id: string) => void;
}) {
	const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

	const grouped = useMemo(() => {
		const filtered = entries.filter(
			(entry) => filter === "all" || entry.type === filter,
		);
		const map = new Map<string, Entry[]>();
		for (const entry of filtered) {
			const day = entry.date.slice(0, 10);
			const dayEntries = map.get(day) ?? [];
			dayEntries.push(entry);
			map.set(day, dayEntries);
		}
		return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
	}, [entries, filter]);

	return (
		<Tabs
			value={filter}
			onValueChange={(v) => setFilter(v as "all" | "income" | "expense")}
		>
			<TabsList className="mb-4 w-full">
				<TabsTrigger value="all" className="flex-1">
					Todas
				</TabsTrigger>
				<TabsTrigger value="income" className="flex-1">
					Receitas
				</TabsTrigger>
				<TabsTrigger value="expense" className="flex-1">
					Despesas
				</TabsTrigger>
			</TabsList>

			<TabsContent value={filter}>
				{loading ? (
					<div className="space-y-4">
						{[1, 2].map((g) => (
							<div key={g} className="space-y-2">
								<Skeleton className="ml-1 h-3 w-16" />
								<Card>
									<CardContent className="p-0">
										{[1, 2, 3].map((n) => (
											<div
												key={n}
												className="flex items-center gap-3 px-4 py-3"
											>
												<Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
												<div className="flex-1 space-y-1.5">
													<Skeleton className="h-3.5 w-28" />
													<Skeleton className="h-3 w-20" />
												</div>
												<Skeleton className="h-3.5 w-16" />
											</div>
										))}
									</CardContent>
								</Card>
							</div>
						))}
					</div>
				) : grouped.length === 0 ? (
					<p className="py-8 text-center text-muted-foreground text-sm">
						Nenhuma transação encontrada.{" "}
						<button
							type="button"
							onClick={onAddEntry}
							className="underline underline-offset-2 hover:text-foreground"
						>
							Adicione uma agora.
						</button>
					</p>
				) : (
					<div className="space-y-4">
						{grouped.map(([day, dayEntries]) => (
							<div key={day} className="space-y-2">
								<p className="ml-1 font-semibold text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
									{formatDayHeader(day)}
								</p>
								<Card>
									<CardContent className="p-0">
										<ul>
											<AnimatePresence initial={false}>
												{dayEntries.map((entry) => {
													const primaryCategory =
														entry.entryCategories[0]?.category;
													return (
														<motion.li
															key={entry.id}
															layout
															initial={{ opacity: 1 }}
															exit={{
																opacity: 0,
																x: -24,
																transition: { duration: 0.22, ease: "easeIn" },
															}}
															className="flex items-center gap-3 border-b px-4 py-3 last:border-b-0"
														>
															<EntryIcon entry={entry} />
															<div className="min-w-0 flex-1">
																<p className="truncate font-medium text-sm">
																	{entry.title}
																</p>
																<p className="text-[11px] text-muted-foreground">
																	{formatDate(entry.date)}
																	{primaryCategory
																		? ` · ${primaryCategory.name}`
																		: ""}
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
															<DropdownMenu>
																<DropdownMenuTrigger
																	className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
																	aria-label="Opções"
																>
																	<MoreHorizontal className="h-4 w-4" />
																</DropdownMenuTrigger>
																<DropdownMenuContent align="end">
																	<DropdownMenuItem
																		onClick={() => onEdit(entry)}
																	>
																		<Pencil />
																		Editar
																	</DropdownMenuItem>
																	<DropdownMenuSeparator />
																	<DropdownMenuItem
																		variant="destructive"
																		onClick={() => onDelete(entry.id)}
																	>
																		<Trash2 />
																		Excluir
																	</DropdownMenuItem>
																</DropdownMenuContent>
															</DropdownMenu>
														</motion.li>
													);
												})}
											</AnimatePresence>
										</ul>
									</CardContent>
								</Card>
							</div>
						))}
					</div>
				)}
			</TabsContent>
		</Tabs>
	);
}
