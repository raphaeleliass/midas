"use client";

import { Button } from "@midas/ui/components/button";
import { Calendar } from "@midas/ui/components/calendar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@midas/ui/components/dialog";
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
import { cn } from "@midas/ui/lib/utils";
import { CalendarIcon, Check, Plus, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CategoryIcon } from "@/lib/category-icons";
import { BASE, brlToCents, type Category, type Entry } from "@/lib/finance";

export function EditEntryDialog({
	entry,
	onClose,
	categories,
	onSuccess,
	onManageCategories,
	onNewCategory,
}: {
	entry: Entry | null;
	onClose: () => void;
	categories: Category[];
	onSuccess: () => Promise<void>;
	onManageCategories: () => void;
	onNewCategory: () => void;
}) {
	const [form, setForm] = useState({
		type: "expense" as "expense" | "income",
		title: "",
		amountBrl: "",
		date: "",
		categoryIds: [] as string[],
	});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (entry) {
			setForm({
				type: entry.type,
				title: entry.title,
				amountBrl: (entry.amountCents / 100).toFixed(2).replace(".", ","),
				date: entry.date.slice(0, 10),
				categoryIds: entry.entryCategories.map((ec) => ec.categoryId),
			});
		}
	}, [entry]);

	function toggleCategory(id: string) {
		setForm((prev) => ({
			...prev,
			categoryIds: prev.categoryIds.includes(id)
				? prev.categoryIds.filter((c) => c !== id)
				: [...prev.categoryIds, id],
		}));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!entry) return;
		setSubmitting(true);
		const res = await fetch(`${BASE}/entries/${entry.id}`, {
			method: "PATCH",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				type: form.type,
				title: form.title,
				amountCents: brlToCents(form.amountBrl),
				date: new Date(`${form.date}T12:00:00`).toISOString(),
				categoryIds: form.categoryIds,
			}),
		});
		if (res.ok) {
			onClose();
			await onSuccess();
		}
		setSubmitting(false);
	}

	return (
		<Dialog open={!!entry} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Editar transação</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label>Tipo</Label>
							<Select
								value={form.type}
								onValueChange={(v) =>
									setForm((prev) => ({
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
									{form.date ? (
										new Date(`${form.date}T12:00:00`).toLocaleDateString(
											"pt-BR",
											{ day: "2-digit", month: "long", year: "numeric" },
										)
									) : (
										<span className="text-muted-foreground">Selecionar</span>
									)}
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={
											form.date ? new Date(`${form.date}T12:00:00`) : undefined
										}
										onSelect={(date) =>
											date &&
											setForm((prev) => ({
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
							value={form.title}
							onChange={(e) =>
								setForm((prev) => ({ ...prev, title: e.target.value }))
							}
							placeholder="Ex: Aluguel"
							required
						/>
					</div>
					<div className="space-y-1.5">
						<Label>Valor (R$)</Label>
						<Input
							value={form.amountBrl}
							onChange={(e) =>
								setForm((prev) => ({ ...prev, amountBrl: e.target.value }))
							}
							placeholder="0,00"
							required
						/>
					</div>
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label>Categorias</Label>
							<div className="flex items-center gap-2">
								{categories.length > 0 && (
									<button
										type="button"
										onClick={onManageCategories}
										className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
									>
										<Settings2 className="h-3 w-3" />
										Gerenciar
									</button>
								)}
								<button
									type="button"
									onClick={onNewCategory}
									className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
								>
									<Plus className="h-3 w-3" />
									Nova
								</button>
							</div>
						</div>
						{categories.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{categories.map((category) => (
									<button
										key={category.id}
										type="button"
										onClick={() => toggleCategory(category.id)}
										className={cn(
											"flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors",
											form.categoryIds.includes(category.id)
												? "border-primary bg-primary/10 text-primary"
												: "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
										)}
									>
										{category.icon && (
											<CategoryIcon
												iconKey={category.icon}
												className="h-3.5 w-3.5"
											/>
										)}
										{category.name}
										{form.categoryIds.includes(category.id) && (
											<Check className="h-3 w-3" />
										)}
									</button>
								))}
							</div>
						)}
					</div>
					<Button type="submit" className="w-full" disabled={submitting}>
						{submitting ? "Salvando..." : "Salvar alterações"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
