"use client";

import { Button } from "@midas/ui/components/button";
import { Card } from "@midas/ui/components/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@midas/ui/components/dialog";
import { Input } from "@midas/ui/components/input";
import { Label } from "@midas/ui/components/label";
import { ChevronRight, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const INITIAL_FORM = { name: "", email: "", password: "" };

export function UserManagementSection() {
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState(INITIAL_FORM);
	const [isPending, setIsPending] = useState(false);

	function updateForm(field: keyof typeof INITIAL_FORM, value: string) {
		setForm((current) => ({ ...current, [field]: value }));
	}

	async function handleSubmit(event: React.FormEvent) {
		event.preventDefault();

		if (form.name.trim().length < 2) {
			toast.error("O nome deve ter pelo menos 2 caracteres.");
			return;
		}
		if (form.password.length < 8) {
			toast.error("A senha deve ter pelo menos 8 caracteres.");
			return;
		}

		setIsPending(true);
		const { error } = await authClient.admin.createUser({
			name: form.name.trim(),
			email: form.email.trim(),
			password: form.password,
			role: "user",
		});
		setIsPending(false);

		if (error) {
			toast.error(error.message ?? "Não foi possível cadastrar o usuário.");
			return;
		}

		toast.success("Usuário cadastrado com sucesso.");
		setForm(INITIAL_FORM);
		setOpen(false);
	}

	return (
		<>
			<section className="space-y-3">
				<p className="px-1 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
					Usuários
				</p>
				<Card className="gap-0 [--card-spacing:0]">
					<button
						type="button"
						onClick={() => setOpen(true)}
						className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/50"
					>
						<UserPlus className="h-4 w-4 text-muted-foreground" />
						<span className="flex-1 font-medium text-sm">
							Cadastrar usuário
						</span>
						<ChevronRight className="h-4 w-4 text-muted-foreground" />
					</button>
				</Card>
			</section>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cadastrar usuário</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit} className="space-y-4 pt-2">
						<div className="space-y-2">
							<Label htmlFor="new-user-name">Nome</Label>
							<Input
								id="new-user-name"
								value={form.name}
								onChange={(event) => updateForm("name", event.target.value)}
								autoComplete="name"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="new-user-email">E-mail</Label>
							<Input
								id="new-user-email"
								type="email"
								value={form.email}
								onChange={(event) => updateForm("email", event.target.value)}
								autoComplete="email"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="new-user-password">Senha</Label>
							<Input
								id="new-user-password"
								type="password"
								value={form.password}
								onChange={(event) => updateForm("password", event.target.value)}
								autoComplete="new-password"
								required
							/>
						</div>
						<div className="flex justify-end gap-2 pt-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
							>
								Cancelar
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? "Cadastrando..." : "Cadastrar"}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
