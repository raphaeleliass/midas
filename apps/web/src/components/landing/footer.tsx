import { Separator } from "@midas/ui/components/separator";
import Link from "next/link";

export function Footer() {
	return (
		<footer className="mx-auto w-full max-w-7xl px-5 pb-8 sm:px-8 lg:px-10">
			<Separator />
			<div className="flex flex-col gap-6 pt-7 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-1">
					<Link href="/" className="w-fit font-semibold tracking-[-0.035em]">
						Midas
					</Link>
					<p className="text-muted-foreground text-sm">
						Finanças pessoais com clareza.
					</p>
				</div>
				<nav
					aria-label="Links do rodapé"
					className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
				>
					<a
						href="#product"
						className="text-muted-foreground transition-colors hover:text-foreground"
					>
						Produto
					</a>
					<a
						href="#features"
						className="text-muted-foreground transition-colors hover:text-foreground"
					>
						Recursos
					</a>
					<Link
						href="/login"
						className="text-muted-foreground transition-colors hover:text-foreground"
					>
						Entrar
					</Link>
				</nav>
			</div>
			<p className="landing-data mt-8 text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
				© {new Date().getFullYear()} Midas
			</p>
		</footer>
	);
}
