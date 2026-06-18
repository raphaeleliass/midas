"use client";

import { Button } from "@midas/ui/components/button";
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

export default function SettingsPage() {
	const { data: subscription, isLoading } = useSubscription();
	const checkout = useCreateCheckout();

	return (
		<div className="mx-auto max-w-lg space-y-8 p-6">
			<div className="space-y-1">
				<h1 className="font-semibold text-lg">Configurações</h1>
				<p className="text-muted-foreground text-sm">
					Gerencie sua conta e assinatura.
				</p>
			</div>

			<div className="space-y-4 rounded-xl border border-border p-5">
				<h2 className="font-medium text-sm">Plano atual</h2>

				{isLoading ? (
					<p className="text-muted-foreground text-sm">Carregando...</p>
				) : subscription?.isPremium ? (
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<span className="rounded-full bg-primary/10 px-3 py-0.5 font-medium text-primary text-xs">
								Premium
							</span>
						</div>
						{subscription.currentPeriodEnd && (
							<p className="text-muted-foreground text-sm">
								Válido até {formatDate(subscription.currentPeriodEnd)}
							</p>
						)}
					</div>
				) : (
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<span className="rounded-full bg-muted px-3 py-0.5 font-medium text-muted-foreground text-xs">
								Gratuito
							</span>
						</div>
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
			</div>
		</div>
	);
}
