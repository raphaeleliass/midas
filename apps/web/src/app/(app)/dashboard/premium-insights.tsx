import { Sparkles } from "lucide-react";

export function PremiumInsights() {
	return (
		<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-5 text-white">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.35),transparent_65%)]" />
			<div className="pointer-events-none absolute -right-6 -bottom-6 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />
			<div className="relative">
				<div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
					<Sparkles className="h-4 w-4 text-white" />
				</div>
				<p className="font-semibold text-base leading-snug">
					Premium Insights para seu Portfólio
				</p>
				<p className="mt-1 text-[12px] text-white/55">
					Análises avançadas e recomendações personalizadas para você.
				</p>
				<button
					type="button"
					className="mt-4 rounded-full border border-white/25 px-4 py-1.5 font-medium text-[12px] text-white transition-colors hover:bg-white/10"
				>
					Saiba mais
				</button>
			</div>
		</div>
	);
}
