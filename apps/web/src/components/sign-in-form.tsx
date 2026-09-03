import { Button } from "@midas/ui/components/button";
import { Input } from "@midas/ui/components/input";
import { Label } from "@midas/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";

export default function SignInForm() {
	const router = useRouter();
	const { isPending } = authClient.useSession();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signIn.email(
				{
					email: value.email,
					password: value.password,
				},
				{
					onSuccess: () => {
						router.replace("/dashboard");
						toast.success("Login realizado com sucesso.");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				email: z.email("Informe um e-mail válido."),
				password: z
					.string()
					.min(8, "A senha deve ter pelo menos 8 caracteres."),
			}),
		},
	});

	if (isPending) {
		return <Loader />;
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-5"
		>
			<form.Field name="email">
				{(field) => (
					<div className="space-y-2">
						<Label htmlFor={field.name}>E-mail</Label>
						<Input
							id={field.name}
							name={field.name}
							type="email"
							autoComplete="email"
							placeholder="nome@exemplo.com"
							required
							aria-invalid={field.state.meta.errors.length > 0}
							className="h-11 rounded-xl border-border bg-background px-3.5 shadow-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:ring-4 focus-visible:ring-ring/15"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
						{field.state.meta.errors.map((error) => (
							<p key={error?.message} className="text-destructive text-sm">
								{error?.message}
							</p>
						))}
					</div>
				)}
			</form.Field>

			<form.Field name="password">
				{(field) => (
					<div className="space-y-2">
						<Label htmlFor={field.name}>Senha</Label>
						<Input
							id={field.name}
							name={field.name}
							type="password"
							autoComplete="current-password"
							placeholder="Sua senha"
							required
							aria-invalid={field.state.meta.errors.length > 0}
							className="h-11 rounded-xl border-border bg-background px-3.5 shadow-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:ring-4 focus-visible:ring-ring/15"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
						{field.state.meta.errors.map((error) => (
							<p key={error?.message} className="text-destructive text-sm">
								{error?.message}
							</p>
						))}
					</div>
				)}
			</form.Field>

			<form.Subscribe
				selector={(state) => ({
					canSubmit: state.canSubmit,
					isSubmitting: state.isSubmitting,
				})}
			>
				{({ canSubmit, isSubmitting }) => (
					<Button
						type="submit"
						size="lg"
						className="h-11 w-full rounded-full bg-primary text-primary-foreground transition-transform hover:bg-primary/85 active:scale-[0.99]"
						disabled={!canSubmit || isSubmitting}
					>
						{isSubmitting ? "Entrando…" : "Entrar"}
					</Button>
				)}
			</form.Subscribe>
		</form>
	);
}
