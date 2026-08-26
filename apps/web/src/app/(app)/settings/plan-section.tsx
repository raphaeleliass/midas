"use client";

import { Button } from "@midas/ui/components/button";
import { Card, CardContent } from "@midas/ui/components/card";
import {
	useCreateCheckout,
	useSubscription,
} from "@/lib/hooks/use-subscription";

function formatDate(isoString: string) {
	return new Date(isoString).toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

export function PlanSection() {
	const { data: subscription, isLoading } = useSubscription();
	const checkout = useCreateCheckout();

	return (
		<section className="space-y-3">
			<p className="px-1 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
				Plano atual
			</p>
			<Card>
				<CardContent className="space-y-3">
					{isLoading ? (
						<p className="text-muted-foreground text-sm">Carregando...</p>
					) : subscription?.isPremium ? (
						<div className="space-y-2">
							<span className="rounded-full bg-primary/10 px-3 py-0.5 font-medium text-primary text-xs">
								Premium
							</span>
							{subscription.currentPeriodEnd && (
								<p className="text-muted-foreground text-sm">
									Válido até {formatDate(subscription.currentPeriodEnd)}
								</p>
							)}
						</div>
					) : (
						<div className="space-y-3">
							<span className="rounded-full bg-muted px-3 py-0.5 font-medium text-muted-foreground text-xs">
								Gratuito
							</span>
							<p className="text-muted-foreground text-sm">
								Apenas categorias padrão · Sem analytics · Sem exportação
							</p>
							<Button
								onClick={() => checkout.mutate()}
								disabled={checkout.isPending}
								className="w-full sm:w-auto"
							>
								{checkout.isPending
									? "Redirecionando..."
									: "Upgrade para Premium — R$ 19,90/mês"}
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</section>
	);
}
