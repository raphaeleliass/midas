"use client";

import { Button } from "@midas/ui/components/button";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { fadeUp, stagger } from "@/lib/animations";
import { authClient } from "@/lib/auth-client";
import { useFirstVisit } from "@/lib/hooks/use-first-visit";
import { useSubscription } from "@/lib/hooks/use-subscription";
import { useCategories, useDeleteCategory, useEntries } from "@/lib/queries";
import { AppHeader } from "../app-header";
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

export default function Dashboard() {
	const isFirstVisit = useFirstVisit("dashboard");
	const { data: sessionData } = authClient.useSession();
	const { data: entries = [], isLoading: entriesLoading } = useEntries();
	const { data: categories = [], isLoading: categoriesLoading } =
		useCategories();
	const { data: subscription } = useSubscription();
	const loading = entriesLoading || categoriesLoading;
	const isPremium = subscription?.isPremium ?? false;
	const deleteCategory = useDeleteCategory();

	const [showEntryForm, setShowEntryForm] = useState(false);
	const [showCategoryForm, setShowCategoryForm] = useState(false);
	const [showManageCategories, setShowManageCategories] = useState(false);
	const [editingCategory, setEditingCategory] = useState<
		(typeof categories)[number] | null
	>(null);
	const [categoryFormSource, setCategoryFormSource] = useState<
		"entryForm" | "manageCategories" | null
	>(null);

	function openCategoryForm(source: "entryForm" | "manageCategories") {
		setCategoryFormSource(source);
		if (source === "entryForm") setShowEntryForm(false);
		if (source === "manageCategories") setShowManageCategories(false);
		setShowCategoryForm(true);
	}

	function handleCategoryFormOpenChange(open: boolean) {
		setShowCategoryForm(open);
		if (!open) {
			if (categoryFormSource === "entryForm") setShowEntryForm(true);
			if (categoryFormSource === "manageCategories")
				setShowManageCategories(true);
			setCategoryFormSource(null);
		}
	}

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
				initial={isFirstVisit ? "hidden" : "show"}
				animate="show"
				className="mx-auto max-w-2xl space-y-4 px-4 pt-4 pb-28 md:px-6 md:pt-6"
			>
				<AppHeader
					title="Finance"
					subtitle={`${greeting}, ${sessionData?.user.name?.split(" ")[0] ?? ""}`}
				/>

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
				onManageCategories={() => {
					setShowEntryForm(false);
					setShowManageCategories(true);
				}}
				onNewCategory={() => openCategoryForm("entryForm")}
			/>

			<CategoryFormDialog
				open={showCategoryForm}
				onOpenChange={handleCategoryFormOpenChange}
			/>

			<ManageCategoriesDialog
				open={showManageCategories}
				onOpenChange={setShowManageCategories}
				categories={categories}
				isPremium={isPremium}
				onEdit={setEditingCategory}
				onDelete={(id) => deleteCategory.mutate(id)}
				onNew={() => openCategoryForm("manageCategories")}
			/>

			<EditCategoryDialog
				category={editingCategory}
				onClose={() => setEditingCategory(null)}
			/>
		</div>
	);
}
