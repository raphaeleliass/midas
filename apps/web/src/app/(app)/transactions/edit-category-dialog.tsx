"use client";

import { Button } from "@midas/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@midas/ui/components/dialog";
import { Input } from "@midas/ui/components/input";
import { Label } from "@midas/ui/components/label";
import { cn } from "@midas/ui/lib/utils";
import { useEffect, useState } from "react";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import { BASE, type Category } from "@/lib/finance";

export function EditCategoryDialog({
	category,
	onClose,
	onSuccess,
}: {
	category: Category | null;
	onClose: () => void;
	onSuccess: () => Promise<void>;
}) {
	const [form, setForm] = useState({ name: "", icon: "" });
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (category) {
			setForm({ name: category.name, icon: category.icon ?? "" });
		}
	}, [category]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!category) return;
		setSubmitting(true);
		const res = await fetch(`${BASE}/categories/${category.id}`, {
			method: "PATCH",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: form.name, icon: form.icon || null }),
		});
		if (res.ok) {
			onClose();
			await onSuccess();
		}
		setSubmitting(false);
	}

	return (
		<Dialog open={!!category} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-sm">
				<DialogHeader>
					<DialogTitle>Editar categoria</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-1.5">
						<Label>Nome</Label>
						<Input
							value={form.name}
							onChange={(e) =>
								setForm((prev) => ({ ...prev, name: e.target.value }))
							}
							placeholder="Ex: Alimentação"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label>Ícone</Label>
						<div className="grid grid-cols-6 gap-1.5">
							{CATEGORY_ICONS.map(({ key, icon: IconComponent, label }) => (
								<button
									key={key}
									type="button"
									title={label}
									onClick={() =>
										setForm((prev) => ({
											...prev,
											icon: prev.icon === key ? "" : key,
										}))
									}
									className={cn(
										"flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
										form.icon === key
											? "border-primary bg-primary/10 text-primary"
											: "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
									)}
								>
									<IconComponent className="h-4 w-4" />
								</button>
							))}
						</div>
					</div>
					<Button type="submit" className="w-full" disabled={submitting}>
						{submitting ? "Salvando..." : "Salvar alterações"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
