import { Button } from "@midas/ui/components/button";
import { Input } from "@midas/ui/components/input";
import { Label } from "@midas/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";

export default function SignUpForm({
	onSwitchToSignIn,
}: {
	onSwitchToSignIn: () => void;
}) {
	const router = useRouter();
	const { isPending } = authClient.useSession();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			name: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signUp.email(
				{
					email: value.email,
					password: value.password,
					name: value.name,
				},
				{
					onSuccess: () => {
						router.push("/dashboard");
						toast.success("Conta criada com sucesso.");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
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
			<div className="grid gap-5 sm:grid-cols-2">
				<form.Field name="name">
					{(field) => (
						<div className="space-y-2">
							<Label htmlFor={field.name}>Nome</Label>
							<Input
								id={field.name}
								name={field.name}
								autoComplete="name"
								placeholder="Seu nome"
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
			</div>

			<form.Field name="password">
				{(field) => (
					<div className="space-y-2">
						<Label htmlFor={field.name}>Senha</Label>
						<Input
							id={field.name}
							name={field.name}
							type="password"
							autoComplete="new-password"
							placeholder="Crie uma senha"
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
						<p className="text-muted-foreground text-xs">
							Mínimo de 8 caracteres.
						</p>
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
						{isSubmitting ? "Criando conta…" : "Criar conta"}
					</Button>
				)}
			</form.Subscribe>
			<div className="pt-1 text-center">
				<Button
					variant="link"
					onClick={onSwitchToSignIn}
					className="h-auto rounded-sm p-0 text-muted-foreground no-underline hover:text-foreground hover:no-underline focus-visible:ring-2 focus-visible:ring-ring"
				>
					Já possui uma conta? Entrar
				</Button>
			</div>
		</form>
	);
}
