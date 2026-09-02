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

type ChangePasswordDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

type PasswordFormState = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};

const INITIAL_STATE: PasswordFormState = {
	currentPassword: "",
	newPassword: "",
	confirmPassword: "",
};

export function ChangePasswordDialog({
	open,
	onOpenChange,
}: ChangePasswordDialogProps) {
	const [form, setForm] = useState<PasswordFormState>(INITIAL_STATE);
	const [isPending, setIsPending] = useState(false);

	function handleChange(field: keyof PasswordFormState, value: string) {
		setForm((prev) => ({ ...prev, [field]: value }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (form.newPassword.length < 8) {
			toast.error("A nova senha deve ter pelo menos 8 caracteres.");
			return;
		}

		if (form.newPassword !== form.confirmPassword) {
			toast.error("As senhas não coincidem.");
			return;
		}

		setIsPending(true);
		const { error } = await authClient.changePassword({
			currentPassword: form.currentPassword,
			newPassword: form.newPassword,
			revokeOtherSessions: false,
		});
		setIsPending(false);

		if (error) {
			toast.error(error.message ?? "Erro ao alterar senha.");
			return;
		}

		toast.success("Senha alterada com sucesso.");
		setForm(INITIAL_STATE);
		onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Alterar senha</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4 pt-2">
					<div className="space-y-2">
						<Label htmlFor="currentPassword">Senha atual</Label>
						<Input
							id="currentPassword"
							type="password"
							value={form.currentPassword}
							onChange={(e) => handleChange("currentPassword", e.target.value)}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="newPassword">Nova senha</Label>
						<Input
							id="newPassword"
							type="password"
							value={form.newPassword}
							onChange={(e) => handleChange("newPassword", e.target.value)}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirmar nova senha</Label>
						<Input
							id="confirmPassword"
							type="password"
							value={form.confirmPassword}
							onChange={(e) => handleChange("confirmPassword", e.target.value)}
							required
						/>
					</div>
					<div className="flex justify-end gap-2 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
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
