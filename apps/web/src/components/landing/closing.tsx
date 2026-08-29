import { Badge } from "@midas/ui/components/badge";
import { Button } from "@midas/ui/components/button";
import { Separator } from "@midas/ui/components/separator";
import { ArrowUpRight, ChartSpline, Tags } from "lucide-react";
import Link from "next/link";
import { Footer } from "./footer";

export function Closing() {
	return (
		<section
			id="premium"
			className="landing-light landing-section bg-background text-foreground"
		>
			<div className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36 lg:px-10 lg:py-44">
				<div className="grid gap-14 lg:grid-cols-[1fr_0.8fr] lg:items-end">
					<div>
						<p className="landing-data text-muted-foreground text-xs uppercase tracking-[0.18em]">
							Comece pelo que aconteceu hoje
						</p>
						<h2 className="mt-6 max-w-4xl text-balance font-medium text-5xl leading-[0.94] tracking-[-0.06em] sm:text-7xl lg:text-[5.8rem]">
							Um registro já muda a sua visão do mês.
						</h2>
					</div>
					<div className="flex flex-col items-start gap-7 lg:pb-2">
						<p className="max-w-lg text-balance text-muted-foreground leading-relaxed sm:text-lg">
							Registre sua primeira receita ou despesa e acompanhe saldo,
							histórico e categorias em um só lugar.
						</p>
						<Button
							size="lg"
							nativeButton={false}
							render={<Link href="/login" />}
						>
							Criar conta grátis
							<ArrowUpRight data-icon="inline-end" />
						</Button>
					</div>
				</div>

				<Separator className="my-16 sm:my-20" />

				<div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
					<div>
						<Badge variant="outline">Plano gratuito</Badge>
						<h3 className="mt-5 font-medium text-2xl tracking-[-0.04em]">
							O essencial para começar.
						</h3>
						<p className="mt-3 max-w-lg text-muted-foreground leading-relaxed">
							Receitas, despesas, saldo e categorias padrão para organizar o mês
							sem custo.
						</p>
					</div>

					<div>
						<div className="flex items-center gap-3">
							<Badge>Premium</Badge>
							<span className="landing-data text-muted-foreground text-xs uppercase tracking-[0.12em]">
								R$ 19,90 / mês
							</span>
						</div>
						<h3 className="mt-5 font-medium text-2xl tracking-[-0.04em]">
							Quando quiser ir além do registro.
						</h3>
						<div className="mt-5 flex flex-col gap-3 text-muted-foreground text-sm">
							<p className="flex items-center gap-3">
								<ChartSpline className="size-4" strokeWidth={1.5} />
								Analytics e comparações por período
							</p>
							<p className="flex items-center gap-3">
								<Tags className="size-4" strokeWidth={1.5} />
								Categorias personalizadas
							</p>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</section>
	);
}
