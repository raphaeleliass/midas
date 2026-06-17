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
import { useState } from "react";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import { useCreateCategory } from "@/lib/queries";

export function CategoryFormDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const createCategory = useCreateCategory();
	const [form, setForm] = useState({ name: "", icon: "" });

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		await createCategory.mutateAsync({
			name: form.name,
			icon: form.icon || null,
		});
		setForm({ name: "", icon: "" });
		onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-sm">
				<DialogHeader>
					<DialogTitle>Nova categoria</DialogTitle>
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
					<Button
						type="submit"
						className="w-full"
						disabled={createCategory.isPending}
					>
						{createCategory.isPending ? "Salvando..." : "Criar categoria"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
