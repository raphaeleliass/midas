import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@midas/ui/components/popover";
import { Skeleton } from "@midas/ui/components/skeleton";
import { Info } from "lucide-react";
import { centsToBrl } from "@/lib/finance";

type TopCategory = { name: string; total: number } | undefined;

export function EfficiencyScoreCard({
	efficiencyScore,
	topCategory,
	monthIncome,
	loading,
}: {
	efficiencyScore: number;
	topCategory: TopCategory;
	monthIncome: number;
	loading: boolean;
}) {
	return (
		<div className="rounded-2xl bg-foreground p-5 text-background">
			{loading ? (
				<div className="space-y-2">
					<Skeleton className="h-3 w-32 bg-background/20" />
					<Skeleton className="h-10 w-24 bg-background/20" />
					<Skeleton className="h-4 w-full bg-background/20" />
				</div>
			) : (
				<>
					<div className="mb-1 flex items-center gap-1.5">
						<p className="font-semibold text-[10px] text-background/50 uppercase tracking-[0.14em]">
							Pontuação de Eficiência
						</p>
						<Popover>
							<PopoverTrigger
								aria-label="O que é a pontuação de eficiência?"
								className="text-background/40 transition-colors hover:text-background/70"
							>
								<Info className="h-3 w-3" />
							</PopoverTrigger>
							<PopoverContent side="top" className="max-w-65 text-sm">
								<p className="font-semibold text-[13px]">
									Pontuação de Eficiência
								</p>
								<p className="mt-1.5 text-[12px] text-muted-foreground leading-relaxed">
									Mede quanto das suas receitas do mês você conseguiu poupar.
									Calculada como:
								</p>
								<p className="mt-2 rounded-md bg-muted px-2.5 py-1.5 font-mono text-[11px]">
									(receitas − despesas) ÷ receitas × 100
								</p>
								<p className="mt-2 text-[12px] text-muted-foreground leading-relaxed">
									<strong>100</strong> - você não gastou nada. <br />
									<strong>0</strong> - despesas igualam ou superam as receitas.
								</p>
							</PopoverContent>
						</Popover>
					</div>
					<p className="font-bold text-4xl tabular-nums leading-none">
						{efficiencyScore}/100
					</p>
					<p className="mt-3 text-[12px] text-background/60 leading-relaxed">
						{topCategory
							? `Sua maior despesa é "${topCategory.name}" com ${centsToBrl(topCategory.total)} neste período.`
							: monthIncome === 0
								? "Adicione receitas para calcular sua pontuação de eficiência."
								: "Sem despesas neste período. Continue assim!"}
					</p>
				</>
			)}
		</div>
	);
}
