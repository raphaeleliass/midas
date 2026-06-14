"use client";

import { env } from "@midas/env/web";
import { Badge } from "@midas/ui/components/badge";
import { Button } from "@midas/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@midas/ui/components/card";
import { Checkbox } from "@midas/ui/components/checkbox";
import { Input } from "@midas/ui/components/input";
import { Label } from "@midas/ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@midas/ui/components/select";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@midas/ui/components/tabs";
import { useCallback, useEffect, useState } from "react";
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
	return new Date(iso).toLocaleDateString("pt-BR");
}

const BASE = env.NEXT_PUBLIC_SERVER_URL;

export default function Dashboard({
	session: _session,
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

	const [showCategoryForm, setShowCategoryForm] = useState(false);
	const [categoryForm, setCategoryForm] = useState({
		name: "",
		icon: "",
		color: "#6366f1",
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
		.reduce((sum, e) => sum + e.amountCents, 0);
	const totalExpense = entries
		.filter((e) => e.type === "expense")
		.reduce((sum, e) => sum + e.amountCents, 0);
	const balance = totalIncome - totalExpense;

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

	async function deleteEntry(id: string) {
		await fetch(`${BASE}/entries/${id}`, {
			method: "DELETE",
			credentials: "include",
		});
		await loadData();
	}

	async function createCategory(e: React.FormEvent) {
		e.preventDefault();
		setSubmitting(true);
		const res = await fetch(`${BASE}/categories`, {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: categoryForm.name,
				icon: categoryForm.icon || undefined,
				color: categoryForm.color || undefined,
			}),
		});
		if (res.ok) {
			setCategoryForm({ name: "", icon: "", color: "#6366f1" });
			setShowCategoryForm(false);
			await loadData();
		}
		setSubmitting(false);
	}

	async function deleteCategory(id: string) {
		await fetch(`${BASE}/categories/${id}`, {
			method: "DELETE",
			credentials: "include",
		});
		await loadData();
	}

	return (
		<div className="space-y-6 p-6">
			{/* Summary cards */}
			<div className="grid grid-cols-3 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="font-medium text-muted-foreground text-sm">
							Receitas
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="font-bold text-2xl text-green-500">
							{centsToBrl(totalIncome)}
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="font-medium text-muted-foreground text-sm">
							Despesas
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="font-bold text-2xl text-red-500">
							{centsToBrl(totalExpense)}
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="font-medium text-muted-foreground text-sm">
							Saldo
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p
							className={`font-bold text-2xl ${balance >= 0 ? "text-green-500" : "text-red-500"}`}
						>
							{centsToBrl(balance)}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="entries">
				<TabsList>
					<TabsTrigger value="entries">Entradas</TabsTrigger>
					<TabsTrigger value="categories">Categorias</TabsTrigger>
				</TabsList>

				{/* Entries tab */}
				<TabsContent value="entries" className="space-y-4">
					<div className="flex items-center justify-between">
						<p className="text-muted-foreground text-sm">
							{entries.length} entradas
						</p>
						<Button size="sm" onClick={() => setShowEntryForm((v) => !v)}>
							{showEntryForm ? "Cancelar" : "+ Nova entrada"}
						</Button>
					</div>

					{showEntryForm && (
						<Card>
							<CardContent className="pt-4">
								<form onSubmit={createEntry} className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-1">
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
										<div className="space-y-1">
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
									<div className="space-y-1">
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
									<div className="space-y-1">
										<Label>Valor (R$)</Label>
										<Input
											value={entryForm.amountBrl}
											onChange={(e) =>
												setEntryForm((prev) => ({
													...prev,
													amountBrl: e.target.value,
												}))
											}
											placeholder="0.00"
											required
										/>
									</div>
									{categories.length > 0 && (
										<div className="space-y-2">
											<Label>Categorias</Label>
											<div className="flex flex-wrap gap-3">
												{categories.map((cat) => (
													<div
														key={cat.id}
														className="flex items-center gap-1.5"
													>
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
									<Button type="submit" disabled={submitting}>
										{submitting ? "Salvando..." : "Salvar"}
									</Button>
								</form>
							</CardContent>
						</Card>
					)}

					{loading ? (
						<p className="text-muted-foreground text-sm">Carregando...</p>
					) : entries.length === 0 ? (
						<p className="text-muted-foreground text-sm">
							Nenhuma entrada ainda.
						</p>
					) : (
						<div className="space-y-2">
							{entries.map((entry) => (
								<Card key={entry.id}>
									<CardContent className="flex items-center justify-between py-3">
										<div className="space-y-1">
											<div className="flex items-center gap-2">
												<span className="font-medium">{entry.title}</span>
												<Badge
													variant={
														entry.type === "income" ? "default" : "destructive"
													}
												>
													{entry.type === "income" ? "Receita" : "Despesa"}
												</Badge>
											</div>
											<div className="flex items-center gap-2 text-muted-foreground text-xs">
												<span>{formatDate(entry.date)}</span>
												{entry.entryCategories.map(({ category: cat }) => (
													<span key={cat.id}>
														{cat.icon} {cat.name}
													</span>
												))}
											</div>
										</div>
										<div className="flex items-center gap-3">
											<span
												className={`font-semibold ${entry.type === "income" ? "text-green-500" : "text-red-500"}`}
											>
												{entry.type === "expense" ? "- " : "+ "}
												{centsToBrl(entry.amountCents)}
											</span>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => deleteEntry(entry.id)}
												className="text-muted-foreground hover:text-destructive"
											>
												✕
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</TabsContent>

				{/* Categories tab */}
				<TabsContent value="categories" className="space-y-4">
					<div className="flex items-center justify-between">
						<p className="text-muted-foreground text-sm">
							{categories.length} categorias
						</p>
						<Button size="sm" onClick={() => setShowCategoryForm((v) => !v)}>
							{showCategoryForm ? "Cancelar" : "+ Nova categoria"}
						</Button>
					</div>

					{showCategoryForm && (
						<Card>
							<CardContent className="pt-4">
								<form onSubmit={createCategory} className="space-y-4">
									<div className="grid grid-cols-3 gap-4">
										<div className="col-span-2 space-y-1">
											<Label>Nome</Label>
											<Input
												value={categoryForm.name}
												onChange={(e) =>
													setCategoryForm((prev) => ({
														...prev,
														name: e.target.value,
													}))
												}
												placeholder="Ex: Alimentação"
												required
											/>
										</div>
										<div className="space-y-1">
											<Label>Ícone (emoji)</Label>
											<Input
												value={categoryForm.icon}
												onChange={(e) =>
													setCategoryForm((prev) => ({
														...prev,
														icon: e.target.value,
													}))
												}
												placeholder="🍔"
											/>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Label>Cor</Label>
										<input
											type="color"
											value={categoryForm.color}
											onChange={(e) =>
												setCategoryForm((prev) => ({
													...prev,
													color: e.target.value,
												}))
											}
											className="h-9 w-16 cursor-pointer rounded border"
										/>
										<span className="text-muted-foreground text-sm">
											{categoryForm.color}
										</span>
									</div>
									<Button type="submit" disabled={submitting}>
										{submitting ? "Salvando..." : "Salvar"}
									</Button>
								</form>
							</CardContent>
						</Card>
					)}

					{loading ? (
						<p className="text-muted-foreground text-sm">Carregando...</p>
					) : categories.length === 0 ? (
						<p className="text-muted-foreground text-sm">
							Nenhuma categoria ainda.
						</p>
					) : (
						<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
							{categories.map((cat) => (
								<Card key={cat.id}>
									<CardContent className="flex items-center justify-between py-3">
										<div className="flex items-center gap-2">
											{cat.color && (
												<span
													className="h-3 w-3 rounded-full"
													style={{ backgroundColor: cat.color }}
												/>
											)}
											<span className="text-sm">
												{cat.icon} {cat.name}
											</span>
											{!cat.userId && (
												<span className="text-muted-foreground text-xs">
													(global)
												</span>
											)}
										</div>
										{cat.userId && (
											<Button
												size="sm"
												variant="ghost"
												onClick={() => deleteCategory(cat.id)}
												className="text-muted-foreground hover:text-destructive"
											>
												✕
											</Button>
										)}
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
