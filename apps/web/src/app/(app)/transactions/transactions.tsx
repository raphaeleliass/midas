"use client";

import { env } from "@midas/env/web";
import { Button } from "@midas/ui/components/button";
import { Calendar } from "@midas/ui/components/calendar";
import { Card, CardContent } from "@midas/ui/components/card";
import { Checkbox } from "@midas/ui/components/checkbox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@midas/ui/components/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@midas/ui/components/dropdown-menu";
import { Input } from "@midas/ui/components/input";
import { Label } from "@midas/ui/components/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@midas/ui/components/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@midas/ui/components/select";
import { Skeleton } from "@midas/ui/components/skeleton";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@midas/ui/components/tabs";
import { cn } from "@midas/ui/lib/utils";
import {
	ArrowDown,
	ArrowUp,
	CalendarIcon,
	MoreHorizontal,
	Pencil,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";

type Category = {
	id: string;
	name: string;
	icon: string | null;
	color: string | null;
	userId: string | null;
};

type Entry = {
	id: string;
	type: "expense" | "income";
	title: string;
	subtitle: string | null;
	amountCents: number;
	date: string;
	entryCategories: {
		entryId: string;
		categoryId: string;
		category: Category;
	}[];
};

function centsToBrl(cents: number) {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(cents / 100);
}

function brlToCents(value: string) {
	return Math.round(Number.parseFloat(value.replace(",", ".")) * 100);
}

function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "short",
	});
}

function formatDayHeader(iso: string) {
	const d = new Date(`${iso}T12:00:00`);
	const today = new Date();
	const todayStr = today.toISOString().slice(0, 10);
	if (iso === todayStr) return "Hoje";
	const yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);
	if (iso === yesterday.toISOString().slice(0, 10)) return "Ontem";
	return d.toLocaleDateString("pt-BR", {
		weekday: "long",
		day: "2-digit",
		month: "short",
	});
}

const BASE = env.NEXT_PUBLIC_SERVER_URL;

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 16 },
	show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
};

const stagger: Variants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.08 } },
};

export default function Transactions() {
	const [entries, setEntries] = useState<Entry[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
	const [showEntryForm, setShowEntryForm] = useState(false);
	const [entryForm, setEntryForm] = useState({
		type: "expense" as "expense" | "income",
		title: "",
		amountBrl: "",
		date: new Date().toISOString().split("T")[0],
		categoryIds: [] as string[],
	});
	const [submitting, setSubmitting] = useState(false);
	const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
	const [editForm, setEditForm] = useState({
		type: "expense" as "expense" | "income",
		title: "",
		amountBrl: "",
		date: "",
		categoryIds: [] as string[],
	});
	const [editSubmitting, setEditSubmitting] = useState(false);

	const loadData = useCallback(async () => {
		setLoading(true);
		const [entriesRes, categoriesRes] = await Promise.all([
			fetch(`${BASE}/entries`, { credentials: "include" }),
			fetch(`${BASE}/categories`, { credentials: "include" }),
		]);
		if (entriesRes.ok) setEntries(await entriesRes.json());
		if (categoriesRes.ok) setCategories(await categoriesRes.json());
		setLoading(false);
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const currentMonth = new Date().toISOString().slice(0, 7);
	const monthEntries = entries.filter((e) => e.date.startsWith(currentMonth));
	const monthIncome = monthEntries
		.filter((e) => e.type === "income")
		.reduce((s, e) => s + e.amountCents, 0);
	const monthExpense = monthEntries
		.filter((e) => e.type === "expense")
		.reduce((s, e) => s + e.amountCents, 0);

	const grouped = useMemo(() => {
		const filtered = entries.filter(
			(e) => filter === "all" || e.type === filter,
		);
		const map = new Map<string, Entry[]>();
		for (const e of filtered) {
			const day = e.date.slice(0, 10);
			const bucket = map.get(day) ?? [];
			bucket.push(e);
			map.set(day, bucket);
		}
		return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
	}, [entries, filter]);

	function toggleCategoryId(id: string) {
		setEntryForm((prev) => ({
			...prev,
			categoryIds: prev.categoryIds.includes(id)
				? prev.categoryIds.filter((c) => c !== id)
				: [...prev.categoryIds, id],
		}));
	}

	async function createEntry(e: React.FormEvent) {
		e.preventDefault();
		setSubmitting(true);
		const res = await fetch(`${BASE}/entries`, {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				type: entryForm.type,
				title: entryForm.title,
				amountCents: brlToCents(entryForm.amountBrl),
				date: new Date(`${entryForm.date}T12:00:00`).toISOString(),
				categoryIds: entryForm.categoryIds,
			}),
		});
		if (res.ok) {
			setEntryForm({
				type: "expense",
				title: "",
				amountBrl: "",
				date: new Date().toISOString().split("T")[0],
				categoryIds: [],
			});
			setShowEntryForm(false);
			await loadData();
		}
		setSubmitting(false);
	}

	function openEdit(entry: Entry) {
		setEditForm({
			type: entry.type,
			title: entry.title,
			amountBrl: (entry.amountCents / 100).toFixed(2).replace(".", ","),
			date: entry.date.slice(0, 10),
			categoryIds: entry.entryCategories.map((ec) => ec.categoryId),
		});
		setEditingEntry(entry);
	}

	function toggleEditCategoryId(id: string) {
		setEditForm((prev) => ({
			...prev,
			categoryIds: prev.categoryIds.includes(id)
				? prev.categoryIds.filter((c) => c !== id)
				: [...prev.categoryIds, id],
		}));
	}

	async function updateEntry(e: React.FormEvent) {
		e.preventDefault();
		if (!editingEntry) return;
		setEditSubmitting(true);
		const res = await fetch(`${BASE}/entries/${editingEntry.id}`, {
			method: "PATCH",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				type: editForm.type,
				title: editForm.title,
				amountCents: brlToCents(editForm.amountBrl),
				date: new Date(`${editForm.date}T12:00:00`).toISOString(),
				categoryIds: editForm.categoryIds,
			}),
		});
		if (res.ok) {
			setEditingEntry(null);
			await loadData();
		}
		setEditSubmitting(false);
	}

	async function deleteEntry(id: string) {
		await fetch(`${BASE}/entries/${id}`, {
			method: "DELETE",
			credentials: "include",
		});
		await loadData();
	}

	return (
		<div className="relative min-h-full">
			<motion.div
				variants={stagger}
				initial="hidden"
				animate="show"
				className="mx-auto max-w-2xl space-y-4 px-4 pt-4 pb-28 md:px-6 md:pt-6"
			>
				{/* Header */}
				<motion.header
					variants={fadeUp}
					className="grid grid-cols-3 items-center py-1"
				>
					<button
						type="button"
						className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						aria-label="Buscar"
					>
						<Search className="h-4 w-4" />
					</button>
					<div className="flex justify-center">
						<p className="font-semibold text-sm tracking-tight">Transações</p>
					</div>
					<div />
				</motion.header>

				{/* Month Summary */}
				<motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
					<Card>
						<CardContent>
							<div className="mb-1 flex items-center gap-1.5">
								<ArrowUp className="h-3.5 w-3.5 text-primary" />
								<span className="text-[11px] text-muted-foreground">
									Receitas
								</span>
							</div>
							{loading ? (
								<Skeleton className="h-5 w-24" />
							) : (
								<p className="font-semibold text-primary text-sm tabular-nums">
									+{centsToBrl(monthIncome)}
								</p>
							)}
						</CardContent>
					</Card>
					<Card>
						<CardContent>
							<div className="mb-1 flex items-center gap-1.5">
								<ArrowDown className="h-3.5 w-3.5 text-rose-500" />
								<span className="text-[11px] text-muted-foreground">
									Despesas
								</span>
							</div>
							{loading ? (
								<Skeleton className="h-5 w-24" />
							) : (
								<p className="font-semibold text-rose-500 text-sm tabular-nums dark:text-rose-400">
									-{centsToBrl(monthExpense)}
								</p>
							)}
						</CardContent>
					</Card>
				</motion.div>

				{/* Filter Tabs + Transaction List */}
				<motion.div variants={fadeUp}>
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
										onClick={() => setShowEntryForm(true)}
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
													<ul className="divide-y">
														{dayEntries.map((entry) => {
															const firstCat =
																entry.entryCategories[0]?.category;
															return (
																<li
																	key={entry.id}
																	className="flex items-center gap-3 px-4 py-3"
																>
																	<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-base">
																		{firstCat?.icon ??
																			(entry.type === "income" ? "💰" : "💸")}
																	</div>
																	<div className="min-w-0 flex-1">
																		<p className="truncate font-medium text-sm">
																			{entry.title}
																		</p>
																		<p className="text-[11px] text-muted-foreground">
																			{formatDate(entry.date)}
																			{firstCat ? ` · ${firstCat.name}` : ""}
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
																		<DropdownMenuTrigger asChild>
																			<button
																				type="button"
																				className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
																				aria-label="Opções"
																			>
																				<MoreHorizontal className="h-4 w-4" />
																			</button>
																		</DropdownMenuTrigger>
																		<DropdownMenuContent align="end">
																			<DropdownMenuItem
																				onClick={() => openEdit(entry)}
																			>
																				<Pencil />
																				Editar
																			</DropdownMenuItem>
																			<DropdownMenuSeparator />
																			<DropdownMenuItem
																				variant="destructive"
																				onClick={() => deleteEntry(entry.id)}
																			>
																				<Trash2 />
																				Excluir
																			</DropdownMenuItem>
																		</DropdownMenuContent>
																	</DropdownMenu>
																</li>
															);
														})}
													</ul>
												</CardContent>
											</Card>
										</div>
									))}
								</div>
							)}
						</TabsContent>
					</Tabs>
				</motion.div>
			</motion.div>

			{/* FAB */}
			<motion.div
				className="fixed right-4 bottom-20 z-40 md:bottom-6"
				whileHover={{ scale: 1.08 }}
				whileTap={{ scale: 0.92 }}
			>
				<Button
					size="icon"
					className="h-12 w-12 rounded-full shadow-lg"
					onClick={() => setShowEntryForm(true)}
					aria-label="Nova transação"
				>
					<Plus className="h-5 w-5" />
				</Button>
			</motion.div>

			{/* New entry dialog */}
			<AnimatePresence>
				{showEntryForm && (
					<Dialog open={showEntryForm} onOpenChange={setShowEntryForm}>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Nova transação</DialogTitle>
							</DialogHeader>
							<form onSubmit={createEntry} className="space-y-4">
								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-1.5">
										<Label>Tipo</Label>
										<Select
											value={entryForm.type}
											onValueChange={(v) =>
												setEntryForm((prev) => ({
													...prev,
													type: v as "expense" | "income",
												}))
											}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="expense">Despesa</SelectItem>
												<SelectItem value="income">Receita</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-1.5">
										<Label>Data</Label>
										<Popover>
											<PopoverTrigger className="flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 text-left text-sm hover:bg-accent">
												<CalendarIcon className="h-4 w-4 shrink-0 opacity-50" />
												{entryForm.date ? (
													new Date(
														`${entryForm.date}T12:00:00`,
													).toLocaleDateString("pt-BR", {
														day: "2-digit",
														month: "long",
														year: "numeric",
													})
												) : (
													<span className="text-muted-foreground">
														Selecionar
													</span>
												)}
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={
														entryForm.date
															? new Date(`${entryForm.date}T12:00:00`)
															: undefined
													}
													onSelect={(date) =>
														date &&
														setEntryForm((prev) => ({
															...prev,
															date: date.toISOString().slice(0, 10),
														}))
													}
												/>
											</PopoverContent>
										</Popover>
									</div>
								</div>
								<div className="space-y-1.5">
									<Label>Título</Label>
									<Input
										value={entryForm.title}
										onChange={(e) =>
											setEntryForm((prev) => ({
												...prev,
												title: e.target.value,
											}))
										}
										placeholder="Ex: Aluguel"
										required
									/>
								</div>
								<div className="space-y-1.5">
									<Label>Valor (R$)</Label>
									<Input
										value={entryForm.amountBrl}
										onChange={(e) =>
											setEntryForm((prev) => ({
												...prev,
												amountBrl: e.target.value,
											}))
										}
										placeholder="0,00"
										required
									/>
								</div>
								{categories.length > 0 && (
									<div className="space-y-2">
										<Label>Categorias</Label>
										<div className="flex flex-wrap gap-3">
											{categories.map((cat) => (
												<div key={cat.id} className="flex items-center gap-1.5">
													<Checkbox
														id={`cat-${cat.id}`}
														checked={entryForm.categoryIds.includes(cat.id)}
														onCheckedChange={() => toggleCategoryId(cat.id)}
													/>
													<label
														htmlFor={`cat-${cat.id}`}
														className="cursor-pointer text-sm"
													>
														{cat.icon} {cat.name}
													</label>
												</div>
											))}
										</div>
									</div>
								)}
								<Button type="submit" className="w-full" disabled={submitting}>
									{submitting ? "Salvando..." : "Salvar transação"}
								</Button>
							</form>
						</DialogContent>
					</Dialog>
				)}
			</AnimatePresence>

			{/* Edit entry dialog */}
			<AnimatePresence>
				{editingEntry && (
					<Dialog
						open={!!editingEntry}
						onOpenChange={(open) => !open && setEditingEntry(null)}
					>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Editar transação</DialogTitle>
							</DialogHeader>
							<form onSubmit={updateEntry} className="space-y-4">
								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-1.5">
										<Label>Tipo</Label>
										<Select
											value={editForm.type}
											onValueChange={(v) =>
												setEditForm((prev) => ({
													...prev,
													type: v as "expense" | "income",
												}))
											}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="expense">Despesa</SelectItem>
												<SelectItem value="income">Receita</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-1.5">
										<Label>Data</Label>
										<Popover>
											<PopoverTrigger className="flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 text-left text-sm hover:bg-accent">
												<CalendarIcon className="h-4 w-4 shrink-0 opacity-50" />
												{editForm.date ? (
													new Date(
														`${editForm.date}T12:00:00`,
													).toLocaleDateString("pt-BR", {
														day: "2-digit",
														month: "long",
														year: "numeric",
													})
												) : (
													<span className="text-muted-foreground">
														Selecionar
													</span>
												)}
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={
														editForm.date
															? new Date(`${editForm.date}T12:00:00`)
															: undefined
													}
													onSelect={(date) =>
														date &&
														setEditForm((prev) => ({
															...prev,
															date: date.toISOString().slice(0, 10),
														}))
													}
												/>
											</PopoverContent>
										</Popover>
									</div>
								</div>
								<div className="space-y-1.5">
									<Label>Título</Label>
									<Input
										value={editForm.title}
										onChange={(e) =>
											setEditForm((prev) => ({
												...prev,
												title: e.target.value,
											}))
										}
										placeholder="Ex: Aluguel"
										required
									/>
								</div>
								<div className="space-y-1.5">
									<Label>Valor (R$)</Label>
									<Input
										value={editForm.amountBrl}
										onChange={(e) =>
											setEditForm((prev) => ({
												...prev,
												amountBrl: e.target.value,
											}))
										}
										placeholder="0,00"
										required
									/>
								</div>
								{categories.length > 0 && (
									<div className="space-y-2">
										<Label>Categorias</Label>
										<div className="flex flex-wrap gap-3">
											{categories.map((cat) => (
												<div key={cat.id} className="flex items-center gap-1.5">
													<Checkbox
														id={`edit-cat-${cat.id}`}
														checked={editForm.categoryIds.includes(cat.id)}
														onCheckedChange={() => toggleEditCategoryId(cat.id)}
													/>
													<label
														htmlFor={`edit-cat-${cat.id}`}
														className="cursor-pointer text-sm"
													>
														{cat.icon} {cat.name}
													</label>
												</div>
											))}
										</div>
									</div>
								)}
								<Button
									type="submit"
									className="w-full"
									disabled={editSubmitting}
								>
									{editSubmitting ? "Salvando..." : "Salvar alterações"}
								</Button>
							</form>
						</DialogContent>
					</Dialog>
				)}
			</AnimatePresence>
		</div>
	);
}
