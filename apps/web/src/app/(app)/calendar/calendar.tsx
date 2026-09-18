"use client";

import { Button } from "@midas/ui/components/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@midas/ui/components/sheet";
import { cn } from "@midas/ui/lib/utils";
import {
	ChevronLeft,
	ChevronRight,
	Clock3,
	Pencil,
	Plus,
	Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import {
	type CSSProperties,
	type PointerEvent,
	useMemo,
	useRef,
	useState,
} from "react";
import { AppHeader } from "@/app/(app)/app-header";
import { EntryIcon } from "@/app/(app)/entry-icon";
import { fadeUp, stagger } from "@/lib/animations";
import {
	capitalizeMonthNames,
	centsToBrl,
	type Entry,
	formatMonth,
	getDateKey,
	getTodayInput,
} from "@/lib/finance";
import { useFirstVisit } from "@/lib/hooks/use-first-visit";
import {
	useCalendarEntries,
	useCategories,
	useDeleteEntry,
} from "@/lib/queries";
import { EditEntryDialog } from "../transactions/edit-entry-dialog";
import { EntryFormDialog } from "../transactions/entry-form-dialog";

const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function getMonthKey(date: Date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthDays(month: Date) {
	const first = new Date(
		Date.UTC(month.getFullYear(), month.getMonth(), 1, 12),
	);
	const start = new Date(first);
	start.setUTCDate(1 - first.getUTCDay());
	const days = new Date(
		Date.UTC(month.getFullYear(), month.getMonth() + 1, 0, 12),
	).getUTCDate();
	const weeks = Math.ceil((first.getUTCDay() + days) / 7);
	return Array.from({ length: weeks * 7 }, (_, index) => {
		const day = new Date(start);
		day.setUTCDate(start.getUTCDate() + index);
		return day;
	});
}

function formatSelectedDate(key: string) {
	return capitalizeMonthNames(
		new Date(`${key}T12:00:00`).toLocaleDateString("pt-BR", {
			weekday: "long",
			day: "2-digit",
			month: "long",
			year: "numeric",
		}),
	);
}

function getEntryTone(entry: Entry): CSSProperties {
	if (entry.status === "scheduled") {
		return {
			backgroundColor: "rgb(250 204 21 / 0.18)",
			color: "light-dark(rgb(161 98 7), rgb(253 224 71))",
		};
	}

	return entry.type === "income"
		? {
				backgroundColor: "rgb(16 185 129 / 0.18)",
				color: "light-dark(rgb(4 120 87), rgb(110 231 183))",
			}
		: {
				backgroundColor: "rgb(244 63 94 / 0.14)",
				color: "light-dark(rgb(190 24 93), rgb(253 164 175))",
			};
}

export default function CalendarPage() {
	const isFirstVisit = useFirstVisit("calendar");
	const [month, setMonth] = useState(() => new Date());
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [formDate, setFormDate] = useState<string | null>(null);
	const [showEntryForm, setShowEntryForm] = useState(false);
	const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
	const swipeStart = useRef<{ x: number; y: number } | null>(null);
	const didSwipe = useRef(false);
	const monthKey = getMonthKey(month);
	const previousMonthKey = getMonthKey(
		new Date(month.getFullYear(), month.getMonth() - 1, 1),
	);
	const nextMonthKey = getMonthKey(
		new Date(month.getFullYear(), month.getMonth() + 1, 1),
	);
	const { data: previousMonthEntries = [] } =
		useCalendarEntries(previousMonthKey);
	const { data: entries = [], isLoading } = useCalendarEntries(monthKey);
	const { data: nextMonthEntries = [] } = useCalendarEntries(nextMonthKey);
	const { data: categories = [] } = useCategories();
	const deleteEntry = useDeleteEntry();

	const entriesByDay = useMemo(() => {
		const grouped = new Map<string, Entry[]>();
		for (const entry of [
			...previousMonthEntries,
			...entries,
			...nextMonthEntries,
		]) {
			const key = getDateKey(entry.date);
			grouped.set(key, [...(grouped.get(key) ?? []), entry]);
		}
		return grouped;
	}, [entries, nextMonthEntries, previousMonthEntries]);
	const days = useMemo(() => getMonthDays(month), [month]);
	const weeks = useMemo(
		() =>
			Array.from({ length: days.length / 7 }, (_, index) =>
				days.slice(index * 7, index * 7 + 7),
			),
		[days],
	);
	const selectedEntries = selectedDate
		? (entriesByDay.get(selectedDate) ?? [])
		: [];

	function changeMonth(amount: number) {
		setMonth(
			(current) =>
				new Date(current.getFullYear(), current.getMonth() + amount, 1),
		);
	}

	function handleSwipeStart(event: PointerEvent<HTMLDivElement>) {
		if (event.pointerType !== "touch") return;
		swipeStart.current = { x: event.clientX, y: event.clientY };
		event.currentTarget.setPointerCapture(event.pointerId);
	}

	function handleSwipeEnd(event: PointerEvent<HTMLDivElement>) {
		const start = swipeStart.current;
		swipeStart.current = null;
		if (!start) return;

		const horizontalDistance = event.clientX - start.x;
		const verticalDistance = event.clientY - start.y;
		if (
			Math.abs(horizontalDistance) < 56 ||
			Math.abs(horizontalDistance) <= Math.abs(verticalDistance)
		) {
			return;
		}

		didSwipe.current = true;
		changeMonth(horizontalDistance < 0 ? 1 : -1);
		window.setTimeout(() => {
			didSwipe.current = false;
		}, 0);
	}

	function openDay(date: Date) {
		setSelectedDate(getDateKey(date));
	}

	function createForDate(date: string) {
		setSelectedDate(null);
		setFormDate(date);
		setShowEntryForm(true);
	}

	return (
		<div className="relative min-h-full">
			<motion.div
				variants={stagger}
				initial={isFirstVisit ? "hidden" : "show"}
				animate="show"
				className="mx-auto max-w-5xl space-y-5 px-4 pt-4 pb-28 md:px-6 md:pt-6"
			>
				<AppHeader title="Calendário" />

				<motion.section
					variants={fadeUp}
					className="-mx-4 overflow-hidden rounded-[28px] border bg-card shadow-sm sm:mx-0"
				>
					<div className="flex items-end justify-between gap-3 px-5 pt-6 pb-5 md:px-6">
						<div>
							<p className="text-muted-foreground text-xs">
								Planejamento financeiro
							</p>
							<h1 className="mt-1 font-semibold text-3xl tracking-tight md:text-4xl">
								{formatMonth(monthKey).replace(" de ", " ")}
							</h1>
						</div>
						<div className="flex items-center gap-1">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => changeMonth(-1)}
								aria-label="Mês anterior"
							>
								<ChevronLeft />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => changeMonth(1)}
								aria-label="Próximo mês"
							>
								<ChevronRight />
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setMonth(new Date())}
							>
								Hoje
							</Button>
						</div>
					</div>

					<div className="flex border-y">
						{weekdays.map((day) => (
							<p
								key={day}
								className="flex-1 py-3.5 text-center font-medium text-muted-foreground text-xs uppercase tracking-wide"
							>
								{day}
							</p>
						))}
					</div>
					<div
						className="touch-pan-y"
						onPointerDown={handleSwipeStart}
						onPointerUp={handleSwipeEnd}
						onPointerCancel={() => {
							swipeStart.current = null;
						}}
					>
						{weeks.map((week) => (
							<div
								key={getDateKey(week[0] ?? new Date())}
								className="flex min-h-40 border-b last:border-b-0 sm:min-h-44"
							>
								{week.map((date, dayIndex) => {
									const dateKey = getDateKey(date);
									const dayEntries = entriesByDay.get(dateKey) ?? [];
									const currentMonth = date.getUTCMonth() === month.getMonth();
									const isToday = dateKey === getTodayInput();
									return (
										<button
											key={dateKey}
											type="button"
											onClick={() => {
												if (didSwipe.current) {
													didSwipe.current = false;
													return;
												}
												openDay(date);
											}}
											className={cn(
												"flex min-w-0 flex-1 flex-col justify-between overflow-hidden px-1 pt-3 pb-3 text-left transition-colors hover:bg-muted/60 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-2 sm:pt-4",
												dayIndex < week.length - 1 && "border-r",
												!currentMonth && "text-muted-foreground",
											)}
										>
											<span
												className={cn(
													"mx-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[17px] tabular-nums",
													isToday &&
														"bg-primary font-semibold text-primary-foreground",
												)}
											>
												{date.getUTCDate()}
											</span>
											{
												<div className="w-full space-y-1 overflow-hidden">
													{dayEntries.slice(0, 2).map((entry) => (
														<div
															key={entry.id}
															className={cn(
																"min-w-0 rounded-md px-1 py-1 font-medium text-[9px] leading-tight sm:px-1.5 sm:text-[11px]",
															)}
															style={getEntryTone(entry)}
															title={`${entry.title} · ${centsToBrl(entry.amountCents)}`}
														>
															<div className="flex min-w-0 items-center gap-0.5">
																{entry.status === "scheduled" && (
																	<Clock3 className="h-2.5 w-2.5 shrink-0" />
																)}
																<span className="truncate">{entry.title}</span>
															</div>
															<span className="block truncate opacity-80">
																{centsToBrl(entry.amountCents)}
															</span>
														</div>
													))}
													{dayEntries.length > 2 && (
														<p className="px-1 text-center font-medium text-[10px] text-muted-foreground sm:text-xs">
															+{dayEntries.length - 2}
														</p>
													)}
												</div>
											}
										</button>
									);
								})}
							</div>
						))}
					</div>
					{isLoading && (
						<p className="px-4 py-3 text-center text-muted-foreground text-sm">
							Carregando lançamentos...
						</p>
					)}
				</motion.section>
			</motion.div>

			<motion.div
				className="fixed right-4 bottom-20 z-40 md:bottom-6"
				whileHover={{ scale: 1.08 }}
				whileTap={{ scale: 0.92 }}
			>
				<Button
					size="icon"
					className="h-12 w-12 rounded-full shadow-lg"
					onClick={() => createForDate(getTodayInput())}
					aria-label="Novo lançamento"
				>
					<Plus className="h-5 w-5" />
				</Button>
			</motion.div>

			<Sheet
				open={selectedDate !== null}
				onOpenChange={(open) => !open && setSelectedDate(null)}
			>
				<SheetContent
					side="bottom"
					className="max-h-[90dvh] overflow-y-auto rounded-t-2xl"
				>
					<SheetHeader className="px-5 pt-7 pb-5 sm:px-6">
						<SheetTitle>
							{selectedDate && formatSelectedDate(selectedDate)}
						</SheetTitle>
						<p className="text-muted-foreground text-sm">
							{selectedEntries.length
								? `${selectedEntries.length} lançamento${selectedEntries.length > 1 ? "s" : ""}`
								: "Nenhum lançamento neste dia"}
						</p>
					</SheetHeader>
					<div className="space-y-3 px-5 pb-7 sm:px-6">
						{selectedEntries.map((entry) => (
							<div
								key={entry.id}
								className="space-y-4 rounded-2xl border bg-card p-4"
							>
								<div className="flex items-start gap-3">
									<EntryIcon entry={entry} />
									<div className="min-w-0 flex-1">
										<p className="truncate font-medium">{entry.title}</p>
										<p className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
											{entry.status === "scheduled" && (
												<>
													<Clock3 className="h-3 w-3" /> Programado
												</>
											)}
											{entry.status === "posted" && "Realizado"}
										</p>
									</div>
									<div className="flex shrink-0 items-center gap-1">
										<Button
											variant="ghost"
											size="icon-lg"
											aria-label={`Editar ${entry.title}`}
											title="Editar lançamento"
											onClick={() => {
												setSelectedDate(null);
												setEditingEntry(entry);
											}}
										>
											<Pencil />
										</Button>
										<Button
											variant="destructive"
											size="icon-lg"
											aria-label={`Excluir ${entry.title}`}
											title="Excluir lançamento"
											onClick={() => {
												deleteEntry.mutate(entry.id);
												setSelectedDate(null);
											}}
										>
											<Trash2 />
										</Button>
									</div>
								</div>
								<div className="border-t pt-3">
									<p
										className={cn(
											"font-semibold text-base tabular-nums",
											entry.type === "income"
												? "text-primary"
												: "text-rose-500 dark:text-rose-400",
										)}
									>
										{entry.type === "income" ? "+" : "−"}
										{centsToBrl(entry.amountCents)}
									</p>
								</div>
							</div>
						))}
						<Button
							className="mt-2 w-full"
							onClick={() => selectedDate && createForDate(selectedDate)}
						>
							<Plus /> Adicionar lançamento
						</Button>
					</div>
				</SheetContent>
			</Sheet>

			<EntryFormDialog
				open={showEntryForm}
				onOpenChange={setShowEntryForm}
				categories={categories}
				defaultDate={formDate ?? getTodayInput()}
			/>
			<EditEntryDialog
				entry={editingEntry}
				onClose={() => setEditingEntry(null)}
				categories={categories}
			/>
		</div>
	);
}
