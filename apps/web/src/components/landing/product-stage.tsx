import { cn } from "@midas/ui/lib/utils";
import {
	ChartNoAxesCombined,
	LayoutDashboard,
	ReceiptText,
	Tag,
} from "lucide-react";

export type ProductView = "transactions" | "dashboard" | "analytics";

type ProductStageProps = {
	mode: ProductView;
	className?: string;
};

const TRANSACTIONS = [
	{ title: "Salário", category: "Trabalho", amount: "+ R$ 4.850,00" },
	{ title: "Aluguel", category: "Moradia", amount: "− R$ 1.420,00" },
	{
		title: "Mercado da semana",
		category: "Mercado",
		amount: "− R$ 286,40",
	},
];

const BAR_HEIGHTS = [42, 58, 48, 71, 64, 82, 72, 91, 77, 88];

function ProductHeader({ label }: { label: string }) {
	return (
		<div className="flex h-12 items-center justify-between border-b px-4 sm:px-6">
			<div className="flex items-center gap-3">
				<span className="font-semibold tracking-[-0.035em]">Midas</span>
				<span className="hidden h-4 w-px bg-border sm:block" />
				<span className="hidden text-muted-foreground text-xs sm:inline">
					{label}
				</span>
			</div>
			<span className="landing-data text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
				Agosto 2026
			</span>
		</div>
	);
}

function ProductSidebar({ mode }: { mode: ProductView }) {
	const items = [
		{ key: "dashboard", label: "Visão geral", icon: LayoutDashboard },
		{ key: "transactions", label: "Transações", icon: ReceiptText },
		{ key: "analytics", label: "Analytics", icon: ChartNoAxesCombined },
	] as const;

	return (
		<aside className="hidden w-44 shrink-0 border-r p-3 md:block">
			<div className="flex flex-col gap-1">
				{items.map((item) => {
					const Icon = item.icon;
					return (
						<div
							key={item.key}
							className={cn(
								"flex items-center gap-2 rounded-lg px-3 py-2 text-xs",
								mode === item.key
									? "bg-muted text-foreground"
									: "text-muted-foreground",
							)}
						>
							<Icon className="size-3.5" strokeWidth={1.5} />
							{item.label}
						</div>
					);
				})}
			</div>
		</aside>
	);
}

function DashboardView() {
	return (
		<div className="grid flex-1 gap-3 p-4 sm:grid-cols-[1.1fr_0.9fr] sm:p-6">
			<div className="flex min-h-44 flex-col justify-between rounded-2xl border bg-background p-5 sm:min-h-64">
				<div>
					<p className="text-muted-foreground text-xs">Saldo atual</p>
					<p className="landing-data mt-2 font-medium text-3xl tracking-[-0.05em] sm:text-5xl">
						R$ 3.143,60
					</p>
				</div>
				<div className="grid grid-cols-2 gap-3">
					<div>
						<p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
							Receitas
						</p>
						<p className="landing-data mt-1 text-sm">R$ 4.850,00</p>
					</div>
					<div>
						<p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
							Despesas
						</p>
						<p className="landing-data mt-1 text-sm">R$ 1.706,40</p>
					</div>
				</div>
			</div>
			<div className="hidden rounded-2xl border bg-background p-5 sm:flex sm:flex-col">
				<div className="flex items-start justify-between">
					<div>
						<p className="text-muted-foreground text-xs">Ritmo do mês</p>
						<p className="mt-1 font-medium text-sm">Saldo por dia</p>
					</div>
					<ChartNoAxesCombined
						className="size-4 text-muted-foreground"
						strokeWidth={1.5}
					/>
				</div>
				<div className="mt-auto flex h-32 items-end gap-2 border-b pb-2">
					{BAR_HEIGHTS.map((height, index) => (
						<div
							key={`${height}-${index}`}
							className="flex-1 rounded-t-sm bg-foreground/20"
							style={{ height: `${height}%` }}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

function TransactionsView() {
	return (
		<div className="flex flex-1 flex-col p-4 sm:p-6">
			<div className="mb-4 flex items-end justify-between">
				<div>
					<p className="text-muted-foreground text-xs">Movimentações</p>
					<h3 className="mt-1 font-medium text-xl tracking-[-0.035em]">
						Transações recentes
					</h3>
				</div>
				<span className="landing-data rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.1em]">
					Todas
				</span>
			</div>
			<div className="overflow-hidden rounded-2xl border bg-background">
				{TRANSACTIONS.map((transaction, index) => (
					<div
						key={transaction.title}
						className="flex items-center gap-3 border-b px-4 py-3 last:border-b-0 sm:px-5 sm:py-4"
					>
						<div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted">
							{index === 0 ? (
								<ReceiptText className="size-4" strokeWidth={1.5} />
							) : (
								<Tag className="size-4" strokeWidth={1.5} />
							)}
						</div>
						<div className="min-w-0 flex-1">
							<p className="truncate font-medium text-sm">
								{transaction.title}
							</p>
							<p className="text-muted-foreground text-xs">
								{transaction.category}
							</p>
						</div>
						<p className="landing-data shrink-0 text-xs sm:text-sm">
							{transaction.amount}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}

function AnalyticsView() {
	return (
		<div className="grid flex-1 gap-3 p-4 sm:grid-cols-[1.2fr_0.8fr] sm:p-6">
			<div className="flex min-h-52 flex-col rounded-2xl border bg-background p-5 sm:min-h-64">
				<div className="flex items-start justify-between">
					<div>
						<p className="text-muted-foreground text-xs">Evolução do saldo</p>
						<p className="landing-data mt-1 text-lg">+ R$ 1.268,20</p>
					</div>
					<span className="landing-data rounded-full bg-muted px-2.5 py-1 text-[9px] uppercase tracking-[0.1em]">
						6 meses
					</span>
				</div>
				<svg
					viewBox="0 0 600 180"
					className="mt-auto w-full text-foreground"
					role="img"
					aria-label="Gráfico de evolução crescente do saldo"
				>
					<path
						d="M8 151 C 75 140, 92 95, 160 112 S 260 148, 318 90 S 410 72, 458 54 S 528 78, 592 20"
						fill="none"
						stroke="currentColor"
						strokeWidth="3"
						vectorEffect="non-scaling-stroke"
					/>
					<path
						d="M8 170 H592"
						fill="none"
						stroke="currentColor"
						strokeOpacity="0.14"
						strokeWidth="1"
						vectorEffect="non-scaling-stroke"
					/>
				</svg>
			</div>
			<div className="flex flex-col justify-between rounded-2xl border bg-background p-5">
				<div>
					<p className="text-muted-foreground text-xs">Maior categoria</p>
					<p className="mt-1 font-medium text-lg tracking-[-0.03em]">Moradia</p>
				</div>
				<div className="my-5 flex aspect-square max-h-28 items-center justify-center self-center rounded-full border-[14px] border-muted">
					<span className="landing-data text-sm">43%</span>
				</div>
				<p className="text-muted-foreground text-xs leading-relaxed">
					Veja onde o dinheiro se concentra e compare períodos.
				</p>
			</div>
		</div>
	);
}

export function ProductStage({ mode, className }: ProductStageProps) {
	const label =
		mode === "transactions"
			? "Transações"
			: mode === "analytics"
				? "Analytics"
				: "Visão geral";

	return (
		<div
			className={cn(
				"overflow-hidden rounded-[1.5rem] border bg-card text-card-foreground shadow-2xl shadow-background",
				className,
			)}
		>
			<ProductHeader label={label} />
			<div className="flex min-h-72 sm:min-h-80">
				<ProductSidebar mode={mode} />
				{mode === "transactions" ? (
					<TransactionsView />
				) : mode === "analytics" ? (
					<AnalyticsView />
				) : (
					<DashboardView />
				)}
			</div>
		</div>
	);
}
