"use client";

import { Button } from "@midas/ui/components/button";
import { Bell, Plus, Search } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fadeUp, stagger } from "@/lib/animations";
import type { authClient } from "@/lib/auth-client";
import { BASE, type Category, type Entry } from "@/lib/finance";
import { SummaryCards } from "../summary-cards";
import { CategoryFormDialog } from "../transactions/category-form-dialog";
import { EditCategoryDialog } from "../transactions/edit-category-dialog";
import { EntryFormDialog } from "../transactions/entry-form-dialog";
import { ManageCategoriesDialog } from "../transactions/manage-categories-dialog";
import { BalanceCard } from "./balance-card";
import { ExpensesByCategoryCard } from "./expenses-by-category-chart";
import { PremiumInsights } from "./premium-insights";
import { RecentTransactionsCard } from "./recent-transactions-card";
import { SavingsGoalCard } from "./savings-goal-card";
import { TrendCard } from "./trend-chart";

const SAVINGS_GOAL_CENTS = 200_000;

export default function Dashboard({
	session,
}: {
	session: typeof authClient.$Infer.Session;
}) {
	const [entries, setEntries] = useState<Entry[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [showEntryForm, setShowEntryForm] = useState(false);
	const [showCategoryForm, setShowCategoryForm] = useState(false);
	const [showManageCategories, setShowManageCategories] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);

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
		.filter((entry) => entry.type === "income")
		.reduce((sum, entry) => sum + entry.amountCents, 0);
	const totalExpense = entries
		.filter((entry) => entry.type === "expense")
		.reduce((sum, entry) => sum + entry.amountCents, 0);
	const balance = totalIncome - totalExpense;

	const currentMonth = new Date().toISOString().slice(0, 7);
	const monthEntries = entries.filter((entry) =>
		entry.date.startsWith(currentMonth),
	);
	const monthIncome = monthEntries
		.filter((entry) => entry.type === "income")
		.reduce((sum, entry) => sum + entry.amountCents, 0);
	const monthExpense = monthEntries
		.filter((entry) => entry.type === "expense")
		.reduce((sum, entry) => sum + entry.amountCents, 0);
	const monthBalance = monthIncome - monthExpense;
	const savingsProgress = Math.min(
		100,
		Math.max(0, (monthBalance / SAVINGS_GOAL_CENTS) * 100),
	);

	const greeting = useMemo(() => {
		const currentHour = new Date().getHours();
		if (currentHour < 12) return "Bom dia";
		if (currentHour < 18) return "Boa tarde";
		return "Boa noite";
	}, []);

	return (
		<div className="relative min-h-full">
			<motion.div
				variants={stagger}
				initial="hidden"
				animate="show"
				className="mx-auto max-w-2xl space-y-4 px-4 pt-4 pb-28 md:px-6 md:pt-6"
			>
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

				<motion.div variants={fadeUp}>
					<BalanceCard balance={balance} loading={loading} />
				</motion.div>

				<motion.div variants={fadeUp}>
					<SummaryCards
						income={totalIncome}
						expense={totalExpense}
						loading={loading}
					/>
				</motion.div>

				<motion.div variants={fadeUp}>
					<SavingsGoalCard
						monthBalance={monthBalance}
						savingsProgress={savingsProgress}
						loading={loading}
					/>
				</motion.div>

				<motion.div variants={fadeUp}>
					<TrendCard entries={entries} loading={loading} />
				</motion.div>

				<motion.div variants={fadeUp}>
					<RecentTransactionsCard
						entries={entries}
						loading={loading}
						onAddEntry={() => setShowEntryForm(true)}
					/>
				</motion.div>

				<motion.div variants={fadeUp}>
					<ExpensesByCategoryCard entries={entries} loading={loading} />
				</motion.div>

				<motion.div variants={fadeUp}>
					<PremiumInsights />
				</motion.div>
			</motion.div>

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

			<EntryFormDialog
				open={showEntryForm}
				onOpenChange={setShowEntryForm}
				categories={categories}
				onSuccess={loadData}
				onManageCategories={() => {
					setShowEntryForm(false);
					setShowManageCategories(true);
				}}
				onNewCategory={() => {
					setShowEntryForm(false);
					setShowCategoryForm(true);
				}}
			/>

			<CategoryFormDialog
				open={showCategoryForm}
				onOpenChange={setShowCategoryForm}
				onSuccess={loadData}
			/>

			<ManageCategoriesDialog
				open={showManageCategories}
				onOpenChange={setShowManageCategories}
				categories={categories}
				onEdit={setEditingCategory}
				onDelete={async (id) => {
					await fetch(`${BASE}/categories/${id}`, {
						method: "DELETE",
						credentials: "include",
					});
					await loadData();
				}}
				onNew={() => setShowCategoryForm(true)}
			/>

			<EditCategoryDialog
				category={editingCategory}
				onClose={() => setEditingCategory(null)}
				onSuccess={loadData}
			/>
		</div>
	);
}
