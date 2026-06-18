"use client";

import { Button } from "@midas/ui/components/button";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { fadeUp, stagger } from "@/lib/animations";
import type { Entry } from "@/lib/finance";
import { useFirstVisit } from "@/lib/hooks/use-first-visit";
import { useSubscription } from "@/lib/hooks/use-subscription";
import {
	useCategories,
	useDeleteCategory,
	useDeleteEntry,
	useEntries,
} from "@/lib/queries";
import { AppHeader } from "../app-header";
import { SummaryCards } from "../summary-cards";
import { CategoryFormDialog } from "./category-form-dialog";
import { EditCategoryDialog } from "./edit-category-dialog";
import { EditEntryDialog } from "./edit-entry-dialog";
import { EntryFormDialog } from "./entry-form-dialog";
import { ManageCategoriesDialog } from "./manage-categories-dialog";
import { TransactionList } from "./transaction-list";

type CategoryFormSource = "entryForm" | "editEntry" | "manageCategories" | null;

export default function Transactions() {
	const isFirstVisit = useFirstVisit("transactions");
	const { data: entries = [], isLoading: entriesLoading } = useEntries();
	const { data: categories = [], isLoading: categoriesLoading } =
		useCategories();
	const { data: subscription } = useSubscription();
	const loading = entriesLoading || categoriesLoading;
	const isPremium = subscription?.isPremium ?? false;
	const deleteEntry = useDeleteEntry();
	const deleteCategory = useDeleteCategory();

	const [showEntryForm, setShowEntryForm] = useState(false);
	const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
	const [showCategoryForm, setShowCategoryForm] = useState(false);
	const [showManageCategories, setShowManageCategories] = useState(false);
	const [editingCategory, setEditingCategory] = useState<
		(typeof categories)[number] | null
	>(null);
	const [categoryFormSource, setCategoryFormSource] =
		useState<CategoryFormSource>(null);
	const [savedEditingEntry, setSavedEditingEntry] = useState<Entry | null>(
		null,
	);

	function openCategoryForm(source: CategoryFormSource) {
		setCategoryFormSource(source);
		if (source === "entryForm") setShowEntryForm(false);
		if (source === "editEntry") {
			setSavedEditingEntry(editingEntry);
			setEditingEntry(null);
		}
		if (source === "manageCategories") setShowManageCategories(false);
		setShowCategoryForm(true);
	}

	function handleCategoryFormOpenChange(open: boolean) {
		setShowCategoryForm(open);
		if (!open) {
			if (categoryFormSource === "entryForm") setShowEntryForm(true);
			if (categoryFormSource === "editEntry")
				setEditingEntry(savedEditingEntry);
			if (categoryFormSource === "manageCategories")
				setShowManageCategories(true);
			setCategoryFormSource(null);
			setSavedEditingEntry(null);
		}
	}

	const currentMonth = new Date().toISOString().slice(0, 7);
	const monthEntries = entries.filter((e) => e.date.startsWith(currentMonth));
	const monthIncome = monthEntries
		.filter((e) => e.type === "income")
		.reduce((s, e) => s + e.amountCents, 0);
	const monthExpense = monthEntries
		.filter((e) => e.type === "expense")
		.reduce((s, e) => s + e.amountCents, 0);

	return (
		<div className="relative min-h-full">
			<motion.div
				variants={stagger}
				initial={isFirstVisit ? "hidden" : "show"}
				animate="show"
				className="mx-auto max-w-2xl space-y-4 px-4 pt-4 pb-28 md:px-6 md:pt-6"
			>
				<AppHeader title="Transações" showBell={false} />

				<motion.div variants={fadeUp}>
					<SummaryCards
						income={monthIncome}
						expense={monthExpense}
						loading={loading}
					/>
				</motion.div>

				<motion.div variants={fadeUp}>
					<TransactionList
						entries={entries}
						loading={loading}
						onAddEntry={() => setShowEntryForm(true)}
						onEdit={setEditingEntry}
						onDelete={(id) => deleteEntry.mutate(id)}
					/>
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

			<EditEntryDialog
				entry={editingEntry}
				onClose={() => setEditingEntry(null)}
				categories={categories}
				onManageCategories={() => {
					setEditingEntry(null);
					setShowManageCategories(true);
				}}
				onNewCategory={() => openCategoryForm("editEntry")}
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
