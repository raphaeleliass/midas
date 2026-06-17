"use client";

import { Button } from "@midas/ui/components/button";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { fadeUp, stagger } from "@/lib/animations";
import type { Entry } from "@/lib/finance";
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

export default function Transactions() {
	const { data: entries = [], isLoading: entriesLoading } = useEntries();
	const { data: categories = [], isLoading: categoriesLoading } =
		useCategories();
	const loading = entriesLoading || categoriesLoading;
	const deleteEntry = useDeleteEntry();
	const deleteCategory = useDeleteCategory();

	const [showEntryForm, setShowEntryForm] = useState(false);
	const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
	const [showCategoryForm, setShowCategoryForm] = useState(false);
	const [showManageCategories, setShowManageCategories] = useState(false);
	const [editingCategory, setEditingCategory] = useState<
		(typeof categories)[number] | null
	>(null);

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
				initial="hidden"
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
				onNewCategory={() => {
					setShowEntryForm(false);
					setShowCategoryForm(true);
				}}
			/>

			<EditEntryDialog
				entry={editingEntry}
				onClose={() => setEditingEntry(null)}
				categories={categories}
				onManageCategories={() => {
					setEditingEntry(null);
					setShowManageCategories(true);
				}}
				onNewCategory={() => {
					setEditingEntry(null);
					setShowCategoryForm(true);
				}}
			/>

			<CategoryFormDialog
				open={showCategoryForm}
				onOpenChange={setShowCategoryForm}
			/>

			<ManageCategoriesDialog
				open={showManageCategories}
				onOpenChange={setShowManageCategories}
				categories={categories}
				onEdit={setEditingCategory}
				onDelete={(id) => deleteCategory.mutate(id)}
				onNew={() => setShowCategoryForm(true)}
			/>

			<EditCategoryDialog
				category={editingCategory}
				onClose={() => setEditingCategory(null)}
			/>
		</div>
	);
}
