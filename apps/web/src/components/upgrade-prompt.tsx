"use client";

import { Button } from "@midas/ui/components/button";
import { useCreateCheckout } from "@/lib/hooks/use-subscription";

type UpgradePromptProps = {
	title?: string;
	description?: string;
};

export function UpgradePrompt({
	title = "Recurso Premium",
	description = "Faça upgrade para ter acesso a este recurso.",
}: UpgradePromptProps) {
	const checkout = useCreateCheckout();

	return (
		<div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-muted/30 p-10 text-center">
			<div className="flex flex-col gap-1.5">
				<p className="font-semibold text-foreground">{title}</p>
				<p className="text-muted-foreground text-sm">{description}</p>
			</div>
			<Button
				onClick={() => checkout.mutate()}
				disabled={checkout.isPending}
				className="min-w-40"
			>
				{checkout.isPending ? "Redirecionando..." : "Assinar por R$ 19,90/mês"}
			</Button>
		</div>
	);
}
