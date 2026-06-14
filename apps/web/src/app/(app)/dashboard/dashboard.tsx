"use client";

import { env } from "@midas/env/web";
import { Button } from "@midas/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@midas/ui/components/card";
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
import { Separator } from "@midas/ui/components/separator";
import { cn } from "@midas/ui/lib/utils";
import { ArrowDown, ArrowUp, Bell, Plus } from "lucide-react";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
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

const CHART_W = 320;
const CHART_H = 72;
const PAD_X = 8;
const PAD_Y = 6;
const LABEL_H = 14;
const TOTAL_H = CHART_H + LABEL_H;

function AreaChart({ entries }: { entries: Entry[] }) {
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
				label: d
					.toLocaleDateString("pt-BR", { weekday: "short" })
					.replace(".", ""),
				income,
				expense,
			};
		});
	}, [entries]);

	const maxVal = Math.max(...data.map((d) => Math.max(d.income, d.expense)), 1);
	const stepX = (CHART_W - PAD_X * 2) / 6;
	const availH = CHART_H - PAD_Y * 2;

	const toPoints = (vals: number[]) =>
		vals.map((v, i) => ({
			x: PAD_X + i * stepX,
			y: PAD_Y + availH - (v / maxVal) * availH,
			v,
		}));

	const incomePoints = toPoints(data.map((d) => d.income));
	const expensePoints = toPoints(data.map((d) => d.expense));

	function linePath(pts: { x: number; y: number }[]) {
		return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
	}

	function areaPath(pts: { x: number; y: number }[]) {
		const baseY = PAD_Y + availH;
		const last = pts[pts.length - 1];
		const first = pts[0];
		if (!last || !first) return "";
		return `${linePath(pts)} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`;
	}

	const gridYs = [0.25, 0.5, 0.75].map((r) => PAD_Y + availH - r * availH);

	return (
		<svg viewBox={`0 0 ${CHART_W} ${TOTAL_H}`} width="100%" aria-hidden="true">
			<defs>
				<linearGradient id="inc-grad" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
					<stop offset="100%" stopColor="#10b981" stopOpacity="0" />
				</linearGradient>
				<linearGradient id="exp-grad" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#f87171" stopOpacity="0.22" />
					<stop offset="100%" stopColor="#f87171" stopOpacity="0" />
				</linearGradient>
			</defs>

			{gridYs.map((y, i) => (
				<line
					key={i}
					x1={PAD_X}
					y1={y}
					x2={CHART_W - PAD_X}
					y2={y}
					stroke="currentColor"
					strokeOpacity="0.07"
					strokeDasharray="3 3"
					strokeWidth="1"
				/>
			))}

			<path d={areaPath(incomePoints)} fill="url(#inc-grad)" />
			<path
				d={linePath(incomePoints)}
				fill="none"
				stroke="#10b981"
				strokeWidth="1.5"
				strokeLinejoin="round"
				strokeLinecap="round"
			/>
			{incomePoints
				.filter((p) => p.v > 0)
				.map((p, i) => (
					<circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#10b981" />
				))}

			<path d={areaPath(expensePoints)} fill="url(#exp-grad)" />
			<path
				d={linePath(expensePoints)}
				fill="none"
				stroke="#f87171"
				strokeWidth="1.5"
				strokeLinejoin="round"
				strokeLinecap="round"
			/>
			{expensePoints
				.filter((p) => p.v > 0)
				.map((p, i) => (
					<circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#f87171" />
				))}

			{data.map((d, i) => (
				<text
					key={i}
					x={PAD_X + i * stepX}
					y={TOTAL_H - 1}
					textAnchor="middle"
					fontSize={8.5}
					fill="currentColor"
					opacity={0.38}
				>
					{d.label}
				</text>
			))}
		</svg>
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
			<div className="mx-auto max-w-2xl space-y-4 p-4 pb-24 md:p-6">
				{/* Header */}
				<header className="flex items-center justify-between py-1">
					<div className="flex items-center gap-3">
						<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-sm">
							{session.user.name?.[0]?.toUpperCase() ?? "U"}
						</div>
						<div>
							<p className="text-muted-foreground text-xs">{greeting}</p>
							<p className="font-semibold text-sm leading-tight">
								{session.user.name}
							</p>
						</div>
					</div>
					<button
						type="button"
						className="flex h-9 w-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:text-foreground"
						aria-label="Notificações"
					>
						<Bell className="h-4 w-4" />
					</button>
				</header>

				{/* Balance card */}
				<Card className="overflow-hidden border-0 bg-foreground text-background">
					<CardContent className="p-6">
						<p className="mb-1 font-semibold text-xs uppercase tracking-widest opacity-50">
							Saldo Total
						</p>
						{loading ? (
							<div className="mb-6 h-10 w-44 animate-pulse rounded bg-background/20" />
						) : (
							<p className="mb-6 font-bold text-4xl tabular-nums tracking-tight">
								{centsToBrl(balance)}
							</p>
						)}
						<div className="grid grid-cols-2 gap-4">
							<div className="flex items-center gap-2.5">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
									<ArrowUp className="h-4 w-4 text-emerald-400" />
								</div>
								<div>
									<p className="text-xs opacity-50">Receitas</p>
									<p className="font-semibold text-sm tabular-nums">
										{loading ? "—" : centsToBrl(totalIncome)}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2.5">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/20">
									<ArrowDown className="h-4 w-4 text-red-400" />
								</div>
								<div>
									<p className="text-xs opacity-50">Despesas</p>
									<p className="font-semibold text-sm tabular-nums">
										{loading ? "—" : centsToBrl(totalExpense)}
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Savings Goal */}
				<Card>
					<CardContent className="p-4">
						<div className="mb-3 flex items-center justify-between">
							<p className="font-medium text-sm">Economia do Mês</p>
							<p
								className={cn(
									"font-semibold text-sm tabular-nums",
									monthBalance >= 0
										? "text-emerald-600 dark:text-emerald-400"
										: "text-red-600 dark:text-red-400",
								)}
							>
								{loading ? "—" : centsToBrl(Math.abs(monthBalance))}
							</p>
						</div>
						<Progress
							value={savingsProgress}
							className={cn(
								monthBalance >= 0
									? "[&_[data-slot='progress-indicator']]:bg-emerald-500"
									: "[&_[data-slot='progress-indicator']]:bg-red-400",
							)}
						/>
						<p className="mt-2 text-muted-foreground text-xs">
							{Math.round(savingsProgress)}% da meta · Meta:{" "}
							{centsToBrl(SAVINGS_GOAL_CENTS)}
						</p>
					</CardContent>
				</Card>

				{/* Market Trends */}
				<section>
					<div className="mb-3 flex items-center justify-between">
						<div>
							<h2 className="font-semibold text-sm">Tendências</h2>
							<p className="text-muted-foreground text-xs">Últimos 7 dias</p>
						</div>
						<div className="flex items-center gap-3 text-muted-foreground text-xs">
							<span className="flex items-center gap-1.5">
								<span className="h-2 w-2 rounded-full bg-emerald-500" />
								Receitas
							</span>
							<span className="flex items-center gap-1.5">
								<span className="h-2 w-2 rounded-full bg-red-400" />
								Despesas
							</span>
						</div>
					</div>
					{loading ? (
						<div className="h-20 animate-pulse rounded-lg bg-muted" />
					) : (
						<AreaChart entries={entries} />
					)}
				</section>

				{/* Recent Transactions */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="font-semibold text-sm">
								Transações Recentes
							</CardTitle>
							<Link
								href="/transactions"
								className="text-muted-foreground text-xs transition-colors hover:text-foreground"
							>
								Ver todas →
							</Link>
						</div>
					</CardHeader>
					<CardContent className="p-0 pb-2">
						{loading ? (
							<div className="space-y-px px-4 pb-2">
								{[1, 2, 3].map((n) => (
									<div
										key={n}
										className="h-14 animate-pulse rounded-lg bg-muted"
									/>
								))}
							</div>
						) : entries.length === 0 ? (
							<p className="px-4 py-6 text-center text-muted-foreground text-sm">
								Nenhuma transação.{" "}
								<button
									type="button"
									onClick={() => setShowEntryForm(true)}
									className="underline underline-offset-2 hover:text-foreground"
								>
									Adicione uma agora.
								</button>
							</p>
						) : (
							entries.slice(0, 5).map((entry, i) => {
								const firstCat = entry.entryCategories[0]?.category;
								return (
									<Fragment key={entry.id}>
										{i > 0 && <Separator />}
										<div className="flex items-center gap-3 px-4 py-3">
											<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-base">
												{firstCat?.icon ??
													(entry.type === "income" ? "💰" : "💸")}
											</div>
											<div className="min-w-0 flex-1">
												<p className="truncate font-medium text-sm">
													{entry.title}
												</p>
												<p className="text-muted-foreground text-xs">
													{formatDate(entry.date)}
													{firstCat ? ` · ${firstCat.name}` : ""}
												</p>
											</div>
											<span
												className={cn(
													"shrink-0 font-semibold text-sm tabular-nums",
													entry.type === "income"
														? "text-emerald-600 dark:text-emerald-400"
														: "text-red-600 dark:text-red-400",
												)}
											>
												{entry.type === "income" ? "+" : "−"}
												{centsToBrl(entry.amountCents)}
											</span>
										</div>
									</Fragment>
								);
							})
						)}
					</CardContent>
				</Card>
			</div>

			{/* FAB */}
			<Button
				size="icon"
				className="fixed right-4 bottom-20 z-40 h-12 w-12 rounded-full shadow-lg md:bottom-6"
				onClick={() => setShowEntryForm(true)}
				aria-label="Nova transação"
			>
				<Plus className="h-5 w-5" />
			</Button>

			{/* New entry dialog */}
			<Dialog
				open={showEntryForm}
				onOpenChange={(open) => setShowEntryForm(open)}
			>
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
										setEntryForm((prev) => ({ ...prev, date: e.target.value }))
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
									setEntryForm((prev) => ({ ...prev, title: e.target.value }))
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
		</div>
	);
}
