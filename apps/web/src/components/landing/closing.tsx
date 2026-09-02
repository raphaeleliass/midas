import { Separator } from "@midas/ui/components/separator";
import { Footer } from "./footer";

export function Closing() {
	return (
		<section className="landing-light landing-section bg-background text-foreground">
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
					</div>
				</div>

				<Separator className="my-16 sm:my-20" />

				<div className="max-w-2xl">
					<h3 className="font-medium text-2xl tracking-[-0.04em]">
						Tudo o que você precisa para acompanhar sua vida financeira.
					</h3>
					<p className="mt-3 text-muted-foreground leading-relaxed">
						Registre receitas e despesas, crie categorias personalizadas e use
						Analytics para entender seus hábitos.
					</p>
				</div>
			</div>

			<Footer />
		</section>
	);
}
