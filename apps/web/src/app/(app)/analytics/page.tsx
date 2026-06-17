import { PremiumGate } from "@/components/premium-gate";
import { UpgradePrompt } from "@/components/upgrade-prompt";
import Analytics from "./analytics";

export default function AnalyticsPage() {
	return (
		<PremiumGate
			fallback={
				<div className="flex h-full items-center justify-center p-8">
					<UpgradePrompt
						title="Analytics Premium"
						description="Acesse gráficos avançados, comparativos mensais e métricas de eficiência financeira."
					/>
				</div>
			}
		>
			<Analytics />
		</PremiumGate>
	);
}
