"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

type AuthMode = "signin" | "signup";

export function AuthPage({ mode }: { mode: AuthMode }) {
	const router = useRouter();
	const isSignIn = mode === "signin";

	return (
		<main className="min-h-svh bg-background px-5 py-5 text-foreground sm:px-8 sm:py-7">
			<header className="mx-auto flex w-full max-w-5xl items-center justify-between">
				<Link
					href="/"
					className="rounded-sm font-semibold text-lg tracking-[-0.04em] outline-none transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ring"
				>
					Midas
				</Link>
				<Link
					href="/"
					className="inline-flex items-center gap-1.5 rounded-sm text-muted-foreground text-sm outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
				>
					<ArrowLeft className="size-3.5" aria-hidden="true" />
					Voltar ao início
				</Link>
			</header>

			<section className="mx-auto flex w-full max-w-5xl justify-center py-16 sm:py-24 lg:py-28">
				<div className="w-full max-w-xl">
					<div className="mb-9 text-center sm:mb-10">
						<h1 className="font-semibold text-3xl tracking-[-0.05em] sm:text-4xl">
							{isSignIn ? "Entrar" : "Crie sua conta"}
						</h1>
						<p className="mt-3 text-muted-foreground text-sm sm:text-base">
							{isSignIn
								? "Use suas credenciais Midas para continuar."
								: "Comece a organizar suas finanças com clareza."}
						</p>
					</div>

					{isSignIn ? (
						<SignInForm onSwitchToSignUp={() => router.replace("/register")} />
					) : (
						<SignUpForm onSwitchToSignIn={() => router.replace("/login")} />
					)}
				</div>
			</section>
		</main>
	);
}
