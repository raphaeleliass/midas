"use client";

import { Button } from "@midas/ui/components/button";
import { Plus, Search } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { fadeUp, stagger } from "@/lib/animations";
import { BASE, type Category, type Entry } from "@/lib/finance";
import { SummaryCards } from "../summary-cards";
import { CategoryFormDialog } from "./category-form-dialog";
import { EditCategoryDialog } from "./edit-category-dialog";
import { EditEntryDialog } from "./edit-entry-dialog";
import { EntryFormDialog } from "./entry-form-dialog";
import { ManageCategoriesDialog } from "./manage-categories-dialog";
import { TransactionList } from "./transaction-list";

export default function Transactions() {
	const [entries, setEntries] = useState<Entry[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [showEntryForm, setShowEntryForm] = useState(false);
	const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
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

	const currentMonth = new Date().toISOString().slice(0, 7);
	const monthEntries = entries.filter((e) => e.date.startsWith(currentMonth));
	const monthIncome = monthEntries
		.filter((e) => e.type === "income")
		.reduce((s, e) => s + e.amountCents, 0);
	const monthExpense = monthEntries
		.filter((e) => e.type === "expense")
		.reduce((s, e) => s + e.amountCents, 0);

	async function deleteEntry(id: string) {
		await fetch(`${BASE}/entries/${id}`, {
			method: "DELETE",
			credentials: "include",
		});
		await loadData();
	}

	async function deleteCategory(id: string) {
		await fetch(`${BASE}/categories/${id}`, {
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
						onDelete={deleteEntry}
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

			<EditEntryDialog
				entry={editingEntry}
				onClose={() => setEditingEntry(null)}
				categories={categories}
				onSuccess={loadData}
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
				onSuccess={loadData}
			/>

			<ManageCategoriesDialog
				open={showManageCategories}
				onOpenChange={setShowManageCategories}
				categories={categories}
				onEdit={setEditingCategory}
				onDelete={deleteCategory}
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
