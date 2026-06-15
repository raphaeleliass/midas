"use client";

import { env } from "@midas/env/web";
import { Button } from "@midas/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@midas/ui/components/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@midas/ui/components/chart";
import { Checkbox } from "@midas/ui/components/checkbox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@midas/ui/components/dialog";
import { Input } from "@midas/ui/components/input";
import { Label } from "@midas/ui/components/label";
import { Progress } from "@midas/ui/components/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@midas/ui/components/select";
import { Skeleton } from "@midas/ui/components/skeleton";
import { cn } from "@midas/ui/lib/utils";
import {
	ArrowDown,
	ArrowUp,
	Bell,
	PiggyBank,
	Plus,
	Search,
	Sparkles,
} from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import type { authClient } from "@/lib/auth-client";

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

const BASE = env.NEXT_PUBLIC_SERVER_URL;
const SAVINGS_GOAL_CENTS = 200_000;

const chartConfig = {
	income: {
		label: "Receitas",
		color: "var(--color-primary)",
	},
	expense: {
		label: "Despesas",
		color: "#f43f5e",
	},
} satisfies ChartConfig;

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 16 },
	show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
};

const stagger: Variants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.08 } },
};

function TrendChart({ entries }: { entries: Entry[] }) {
	const data = useMemo(() => {
		const today = new Date();
		return Array.from({ length: 7 }, (_, i) => {
			const d = new Date(today);
			d.setDate(today.getDate() - (6 - i));
			const dayStr = d.toISOString().split("T")[0] as string;
			const dayEntries = entries.filter((e) => e.date.startsWith(dayStr));
			const income = dayEntries
				.filter((e) => e.type === "income")
				.reduce((s, e) => s + e.amountCents, 0);
			const expense = dayEntries
				.filter((e) => e.type === "expense")
				.reduce((s, e) => s + e.amountCents, 0);
			return {
				day: d
					.toLocaleDateString("pt-BR", { weekday: "short" })
					.replace(".", ""),
				income: income / 100,
				expense: expense / 100,
			};
		});
	}, [entries]);

	return (
		<ChartContainer config={chartConfig} className="h-[140px] w-full">
			<AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
				<defs>
					<linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
						<stop
							offset="0%"
							stopColor="var(--color-primary)"
							stopOpacity={0.18}
						/>
						<stop
							offset="100%"
							stopColor="var(--color-primary)"
							stopOpacity={0}
						/>
					</linearGradient>
					<linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#f43f5e" stopOpacity={0.18} />
						<stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
					</linearGradient>
				</defs>
				<CartesianGrid
					vertical={false}
					stroke="currentColor"
					strokeOpacity={0.06}
				/>
				<XAxis
					dataKey="day"
					axisLine={false}
					tickLine={false}
					tick={{ fontSize: 11, fill: "currentColor", opacity: 0.4 }}
					dy={6}
				/>
				<ChartTooltip
					content={
						<ChartTooltipContent
							formatter={(value) =>
								new Intl.NumberFormat("pt-BR", {
									style: "currency",
									currency: "BRL",
								}).format(Number(value))
							}
						/>
					}
				/>
				<Area
					type="monotone"
					dataKey="income"
					stroke="var(--color-primary)"
					strokeWidth={1.5}
					fill="url(#incomeGrad)"
					dot={false}
					activeDot={{ r: 3, fill: "var(--color-primary)" }}
				/>
				<Area
					type="monotone"
					dataKey="expense"
					stroke="#f43f5e"
					strokeWidth={1.5}
					fill="url(#expenseGrad)"
					dot={false}
					activeDot={{ r: 3, fill: "#f43f5e" }}
				/>
			</AreaChart>
		</ChartContainer>
	);
}

export default function Dashboard({
	session,
}: {
	session: typeof authClient.$Infer.Session;
}) {
	const [entries, setEntries] = useState<Entry[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [showEntryForm, setShowEntryForm] = useState(false);
	const [entryForm, setEntryForm] = useState({
		type: "expense" as "expense" | "income",
		title: "",
		amountBrl: "",
		date: new Date().toISOString().split("T")[0],
		categoryIds: [] as string[],
	});
	const [submitting, setSubmitting] = useState(false);

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

	const totalIncome = entries
		.filter((e) => e.type === "income")
		.reduce((s, e) => s + e.amountCents, 0);
	const totalExpense = entries
		.filter((e) => e.type === "expense")
		.reduce((s, e) => s + e.amountCents, 0);
	const balance = totalIncome - totalExpense;

	const currentMonth = new Date().toISOString().slice(0, 7);
	const monthEntries = entries.filter((e) => e.date.startsWith(currentMonth));
	const monthIncome = monthEntries
		.filter((e) => e.type === "income")
		.reduce((s, e) => s + e.amountCents, 0);
	const monthExpense = monthEntries
		.filter((e) => e.type === "expense")
		.reduce((s, e) => s + e.amountCents, 0);
	const monthBalance = monthIncome - monthExpense;
	const savingsProgress = Math.min(
		100,
		Math.max(0, (monthBalance / SAVINGS_GOAL_CENTS) * 100),
	);

	const greeting = useMemo(() => {
		const h = new Date().getHours();
		if (h < 12) return "Bom dia";
		if (h < 18) return "Boa tarde";
		return "Boa noite";
	}, []);

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
					<div className="flex flex-col items-center">
						<p className="font-semibold text-sm tracking-tight">Finance</p>
						<p className="text-[11px] text-muted-foreground">
							{greeting}, {session.user.name?.split(" ")[0]}
						</p>
					</div>
					<div className="flex justify-end">
						<button
							type="button"
							className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							aria-label="Notificações"
						>
							<Bell className="h-4 w-4" />
						</button>
					</div>
				</motion.header>

				{/* Balance */}
				<motion.div variants={fadeUp}>
					<Card>
						<CardContent>
							<p className="mb-1 font-medium text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
								Saldo Total
							</p>
							{loading ? (
								<Skeleton className="h-10 w-48" />
							) : (
								<motion.p
									initial={{ opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
									className="font-bold text-[2.6rem] tabular-nums leading-none tracking-tight"
								>
									{centsToBrl(balance)}
								</motion.p>
							)}
						</CardContent>
					</Card>
				</motion.div>

				{/* Income / Expense */}
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
									+{centsToBrl(totalIncome)}
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
									-{centsToBrl(totalExpense)}
								</p>
							)}
						</CardContent>
					</Card>
				</motion.div>

				{/* Savings Goal */}
				<motion.div variants={fadeUp}>
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
				</motion.div>

				{/* Market Trends */}
				<motion.div variants={fadeUp}>
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="font-semibold text-sm">
									Tendências
								</CardTitle>
								<p className="text-[11px] text-muted-foreground">
									Últimos 7 dias
								</p>
							</div>
						</CardHeader>
						<CardContent>
							{loading ? (
								<Skeleton className="h-[140px] w-full rounded-lg" />
							) : (
								<TrendChart entries={entries} />
							)}
						</CardContent>
					</Card>
				</motion.div>

				{/* Recent Transactions */}
				<motion.div variants={fadeUp}>
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
										onClick={() => setShowEntryForm(true)}
										className="underline underline-offset-2 hover:text-foreground"
									>
										Adicione uma agora.
									</button>
								</p>
							) : (
								<ul className="divide-y">
									{entries.slice(0, 5).map((entry) => {
										const firstCat = entry.entryCategories[0]?.category;
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
											</li>
										);
									})}
								</ul>
							)}
						</CardContent>
					</Card>
				</motion.div>

				{/* Premium Insights */}
				<motion.div variants={fadeUp}>
					<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-5 text-white">
						<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.35),transparent_65%)]" />
						<div className="pointer-events-none absolute -right-6 -bottom-6 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />
						<div className="relative">
							<div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
								<Sparkles className="h-4 w-4 text-white" />
							</div>
							<p className="font-semibold text-base leading-snug">
								Premium Insights para seu Portfólio
							</p>
							<p className="mt-1 text-[12px] text-white/55">
								Análises avançadas e recomendações personalizadas para você.
							</p>
							<button
								type="button"
								className="mt-4 rounded-full border border-white/25 px-4 py-1.5 font-medium text-[12px] text-white transition-colors hover:bg-white/10"
							>
								Saiba mais
							</button>
						</div>
					</div>
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
										<Input
											type="date"
											value={entryForm.date}
											onChange={(e) =>
												setEntryForm((prev) => ({
													...prev,
													date: e.target.value,
												}))
											}
											required
										/>
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
		</div>
	);
}
