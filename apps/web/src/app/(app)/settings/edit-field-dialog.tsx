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
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type EditFieldDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	field: "name" | "email";
	label: string;
	currentValue: string;
	onSuccess: (newValue: string) => void;
};

export function EditFieldDialog({
	open,
	onOpenChange,
	field,
	label,
	currentValue,
	onSuccess,
}: EditFieldDialogProps) {
	const [value, setValue] = useState(currentValue);
	const [isPending, setIsPending] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		const trimmed = value.trim();
		if (!trimmed || trimmed === currentValue) {
			onOpenChange(false);
			return;
		}

		setIsPending(true);
		const { error } = await authClient.updateUser({ [field]: trimmed });
		setIsPending(false);

		if (error) {
			toast.error(error.message ?? `Erro ao atualizar ${label.toLowerCase()}.`);
			return;
		}

		toast.success(`${label} atualizado.`);
		onSuccess(trimmed);
		onOpenChange(false);
	}

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen) setValue(currentValue);
		onOpenChange(nextOpen);
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Alterar {label.toLowerCase()}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4 pt-2">
					<div className="space-y-2">
						<Label htmlFor={field}>{label}</Label>
						<Input
							id={field}
							type={field === "email" ? "email" : "text"}
							value={value}
							onChange={(e) => setValue(e.target.value)}
							required
							autoFocus
						/>
					</div>
					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Salvando..." : "Salvar"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
