import {
	BriefcaseBusiness,
	CalendarDays,
	Check,
	ChevronDown,
	LayoutDashboard,
	Plus,
	ReceiptText,
	ShoppingBasket,
	Tag,
} from "lucide-react";
import {
	AbsoluteFill,
	Easing,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

export type DemoTransaction = {
	id: string;
	type: "income" | "expense";
	title: string;
	amountCents: number;
	category: string;
};

export type MidasDemoProps = {
	initialBalanceCents: number;
	transactions: DemoTransaction[];
};

const INCOME = {
	id: "demo-income",
	type: "income" as const,
	title: "Freela — Projeto Orion",
	amountCents: 275_000,
	category: "Trabalho",
};

const EXPENSE = {
	id: "demo-expense",
	type: "expense" as const,
	title: "Mercado da semana",
	amountCents: 28_640,
	category: "Mercado",
};

const formatBrl = (value: number) =>
	new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value / 100);

function typedText(value: string, frame: number, start: number, end: number) {
	const length = Math.floor(
		interpolate(frame, [start, end], [0, value.length], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}),
	);
	return value.slice(0, length);
}

function DemoCursor({ frame }: { frame: number }) {
	const x = interpolate(
		frame,
		[0, 42, 58, 82, 118, 157, 185, 230, 270, 292, 324, 365, 402, 444, 470, 520],
		[
			1320, 1340, 1132, 626, 650, 620, 812, 1180, 1320, 1132, 626, 650, 812,
			470, 760, 760,
		],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);
	const y = interpolate(
		frame,
		[0, 42, 58, 82, 118, 157, 185, 230, 270, 292, 324, 365, 402, 444, 470, 520],
		[
			760, 678, 514, 354, 456, 558, 658, 585, 678, 514, 354, 456, 558, 658, 254,
			254,
		],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);
	const clickFrames = [43, 59, 82, 157, 185, 271, 293, 324, 365, 402, 445];
	const clickDistance = Math.min(
		...clickFrames.map((click) => Math.abs(frame - click)),
	);
	const clickScale = interpolate(clickDistance, [0, 5], [0.76, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const ringOpacity = interpolate(clickDistance, [0, 7], [0.52, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<div
			className="pointer-events-none absolute top-0 left-0 z-50"
			style={{
				transform: `translate3d(${x}px, ${y}px, 0) scale(${clickScale})`,
			}}
		>
			<div
				className="absolute -top-3 -left-3 size-9 rounded-full border border-foreground"
				style={{
					opacity: ringOpacity,
					transform: `scale(${1.3 - clickScale * 0.3})`,
				}}
			/>
			<svg width="31" height="39" viewBox="0 0 31 39" aria-hidden="true">
				<path
					d="M2 1.5V31L9.6 24.2L15.2 36.5L21.1 33.8L15.5 21.8H27.5L2 1.5Z"
					fill="var(--foreground)"
					stroke="var(--background)"
					strokeWidth="2.2"
					strokeLinejoin="round"
				/>
			</svg>
		</div>
	);
}

function Sidebar() {
	return (
		<aside className="w-[238px] shrink-0 border-r p-5">
			<p className="px-3 text-[12px] text-muted-foreground uppercase tracking-[0.16em]">
				Menu
			</p>
			<div className="mt-4 flex flex-col gap-2">
				<div className="flex items-center gap-3 rounded-xl px-3 py-3 text-[16px] text-muted-foreground">
					<LayoutDashboard className="size-5" strokeWidth={1.5} />
					Visão geral
				</div>
				<div className="flex items-center gap-3 rounded-xl bg-muted px-3 py-3 text-[16px]">
					<ReceiptText className="size-5" strokeWidth={1.5} />
					Transações
				</div>
			</div>
		</aside>
	);
}

function EntryIcon({ type }: { type: "income" | "expense" }) {
	return (
		<div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-muted">
			{type === "income" ? (
				<BriefcaseBusiness className="size-5" strokeWidth={1.5} />
			) : (
				<ShoppingBasket className="size-5" strokeWidth={1.5} />
			)}
		</div>
	);
}

function TransactionRow({
	transaction,
	opacity = 1,
	y = 0,
	highlight = 0,
}: {
	transaction: DemoTransaction;
	opacity?: number;
	y?: number;
	highlight?: number;
}) {
	return (
		<div
			className="flex items-center gap-4 border-b px-6 py-4 last:border-b-0"
			style={{
				opacity,
				transform: `translateY(${y}px)`,
				backgroundColor: `color-mix(in oklch, var(--foreground) ${highlight * 7}%, transparent)`,
			}}
		>
			<EntryIcon type={transaction.type} />
			<div className="min-w-0 flex-1">
				<p className="truncate font-medium text-[18px]">{transaction.title}</p>
				<p className="mt-1 text-[13px] text-muted-foreground">
					Hoje · {transaction.category}
				</p>
			</div>
			<p className="landing-data shrink-0 text-[17px]">
				{transaction.type === "income" ? "+ " : "− "}
				{formatBrl(transaction.amountCents)}
			</p>
		</div>
	);
}

function DemoModal({
	frame,
	kind,
}: {
	frame: number;
	kind: "income" | "expense";
}) {
	const { fps } = useVideoConfig();
	const isIncome = kind === "income";
	const start = isIncome ? 50 : 282;
	const modalScale = spring({
		frame: frame - start,
		fps,
		config: { damping: 20, stiffness: 170 },
	});
	const title = isIncome ? INCOME.title : EXPENSE.title;
	const amount = isIncome ? "2.750,00" : "286,40";
	const category = isIncome ? INCOME.category : EXPENSE.category;
	const titleValue = typedText(title, frame, start + 46, start + 85);
	const amountValue = typedText(amount, frame, start + 94, start + 120);
	const categoryVisible = frame >= start + 124;
	const saved = frame >= start + 133;

	return (
		<div className="absolute inset-0 z-40 flex items-center justify-center bg-background/75 px-10">
			<div
				className="w-[650px] rounded-[28px] border bg-card p-8 shadow-2xl"
				style={{
					opacity: modalScale,
					transform: `translateY(${(1 - modalScale) * 28}px) scale(${0.96 + modalScale * 0.04})`,
				}}
			>
				<div className="flex items-center justify-between">
					<div>
						<p className="text-[12px] text-muted-foreground uppercase tracking-[0.14em]">
							Nova transação
						</p>
						<h3 className="mt-2 font-medium text-[27px] tracking-[-0.04em]">
							{isIncome ? "Adicionar receita" : "Adicionar despesa"}
						</h3>
					</div>
					<div className="flex size-10 items-center justify-center rounded-full border text-muted-foreground">
						<Plus className="size-4 rotate-45" strokeWidth={1.5} />
					</div>
				</div>

				<div className="mt-7 grid grid-cols-2 gap-4">
					<div className="rounded-xl border bg-background px-4 py-3">
						<p className="text-[11px] text-muted-foreground">Tipo</p>
						<div className="mt-2 flex items-center justify-between text-[15px]">
							<span>{isIncome ? "Receita" : "Despesa"}</span>
							<ChevronDown
								className="size-4 text-muted-foreground"
								strokeWidth={1.5}
							/>
						</div>
					</div>
					<div className="rounded-xl border bg-background px-4 py-3">
						<p className="text-[11px] text-muted-foreground">Data</p>
						<div className="mt-2 flex items-center justify-between text-[15px]">
							<span>Hoje</span>
							<CalendarDays
								className="size-4 text-muted-foreground"
								strokeWidth={1.5}
							/>
						</div>
					</div>
				</div>

				<div className="mt-4 rounded-xl border bg-background px-4 py-3">
					<p className="text-[11px] text-muted-foreground">Título</p>
					<p className="mt-2 min-h-6 text-[16px]">
						{titleValue}
						{titleValue.length < title.length ? (
							<span className="ml-0.5 inline-block h-5 w-px bg-foreground align-middle" />
						) : null}
					</p>
				</div>

				<div className="mt-4 rounded-xl border bg-background px-4 py-3">
					<p className="text-[11px] text-muted-foreground">Valor</p>
					<p className="landing-data mt-2 min-h-6 text-[16px]">
						R$ {amountValue}
					</p>
				</div>

				<div className="mt-4 flex items-center gap-2">
					<span className="text-[12px] text-muted-foreground">Categoria</span>
					<div
						className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px]"
						style={{ opacity: categoryVisible ? 1 : 0.32 }}
					>
						<Tag className="size-3.5" strokeWidth={1.5} />
						{categoryVisible ? category : "Selecionar"}
						{categoryVisible ? (
							<Check className="size-3.5" strokeWidth={1.5} />
						) : null}
					</div>
				</div>

				<div className="mt-7 flex h-12 items-center justify-center rounded-xl bg-primary font-medium text-[15px] text-primary-foreground">
					{saved ? "Salvo" : "Salvar transação"}
					{saved ? <Check className="ml-2 size-4" strokeWidth={1.8} /> : null}
				</div>
			</div>
		</div>
	);
}

function FinalSummary({ frame }: { frame: number }) {
	const opacity = interpolate(frame, [480, 500], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});
	const y = interpolate(frame, [480, 510], [24, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	return (
		<div
			className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-background text-center"
			style={{ opacity }}
		>
			<p className="landing-data text-[13px] text-muted-foreground uppercase tracking-[0.18em]">
				Seu mês no Midas
			</p>
			<h3
				className="mt-6 max-w-4xl text-balance font-medium text-[76px] leading-[0.96] tracking-[-0.06em]"
				style={{ transform: `translateY(${y}px)` }}
			>
				Entrou. Saiu. Ficou claro.
			</h3>
			<div className="mt-10 flex items-center gap-10 border-y py-5">
				<div>
					<p className="text-[12px] text-muted-foreground">
						Receita adicionada
					</p>
					<p className="landing-data mt-2 text-[20px]">+ R$ 2.750,00</p>
				</div>
				<div className="h-11 w-px bg-border" />
				<div>
					<p className="text-[12px] text-muted-foreground">
						Despesa adicionada
					</p>
					<p className="landing-data mt-2 text-[20px]">− R$ 286,40</p>
				</div>
			</div>
		</div>
	);
}

export function MidasDemoComposition({
	initialBalanceCents,
	transactions,
}: MidasDemoProps) {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const incomeAdded = frame >= 193;
	const expenseAdded = frame >= 425;
	const incomeProgress = spring({
		frame: frame - 193,
		fps,
		config: { damping: 18, stiffness: 150 },
	});
	const expenseProgress = spring({
		frame: frame - 425,
		fps,
		config: { damping: 18, stiffness: 150 },
	});
	const balanceAfterIncome = interpolate(
		frame,
		[193, 223],
		[initialBalanceCents, initialBalanceCents + INCOME.amountCents],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: Easing.out(Easing.cubic),
		},
	);
	const balance = interpolate(
		frame,
		[425, 458],
		[
			balanceAfterIncome,
			initialBalanceCents + INCOME.amountCents - EXPENSE.amountCents,
		],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: Easing.out(Easing.cubic),
		},
	);
	const listScroll = interpolate(
		frame,
		[218, 250, 438, 468],
		[0, -18, -18, -42],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: Easing.inOut(Easing.cubic),
		},
	);
	const filterExpenses = frame >= 445;
	const visibleTransactions = filterExpenses
		? [...transactions.filter((item) => item.type === "expense"), EXPENSE]
		: [
				...(expenseAdded ? [EXPENSE] : []),
				...(incomeAdded ? [INCOME] : []),
				...transactions,
			];

	return (
		<AbsoluteFill className="bg-background p-10 text-foreground">
			<div className="relative h-full overflow-hidden rounded-[32px] border bg-card shadow-2xl">
				<header className="flex h-[76px] items-center justify-between border-b px-8">
					<div className="flex items-center gap-5">
						<p className="font-semibold text-[22px] tracking-[-0.04em]">
							Midas
						</p>
						<div className="h-5 w-px bg-border" />
						<p className="text-[14px] text-muted-foreground">Transações</p>
					</div>
					<div className="flex items-center gap-4">
						<p className="landing-data text-[12px] text-muted-foreground uppercase tracking-[0.12em]">
							Agosto 2026
						</p>
						<div className="flex size-9 items-center justify-center rounded-full border text-[12px]">
							RE
						</div>
					</div>
				</header>

				<div className="flex h-[calc(100%-76px)]">
					<Sidebar />
					<main className="relative flex-1 overflow-hidden p-7">
						<div className="flex items-end justify-between">
							<div>
								<p className="text-[13px] text-muted-foreground">Saldo atual</p>
								<p className="landing-data mt-2 font-medium text-[42px] tracking-[-0.05em]">
									{formatBrl(Math.round(balance))}
								</p>
							</div>
							<div className="flex h-12 items-center gap-2 rounded-xl bg-primary px-5 font-medium text-[15px] text-primary-foreground">
								<Plus className="size-4" strokeWidth={1.7} />
								Nova transação
							</div>
						</div>

						<div className="mt-7 flex items-center gap-2">
							{["Todas", "Receitas", "Despesas"].map((filter) => {
								const active = filterExpenses
									? filter === "Despesas"
									: filter === "Todas";
								return (
									<div
										key={filter}
										className={
											active
												? "rounded-full bg-primary px-4 py-2 text-[13px] text-primary-foreground"
												: "rounded-full border px-4 py-2 text-[13px] text-muted-foreground"
										}
									>
										{filter}
									</div>
								);
							})}
						</div>

						<div className="mt-4 h-[500px] overflow-hidden rounded-2xl border bg-background">
							<div style={{ transform: `translateY(${listScroll}px)` }}>
								{visibleTransactions.map((transaction) => {
									const isIncomeDemo = transaction.id === INCOME.id;
									const isExpenseDemo = transaction.id === EXPENSE.id;
									const progress = isIncomeDemo
										? incomeProgress
										: isExpenseDemo
											? expenseProgress
											: 1;
									return (
										<TransactionRow
											key={transaction.id}
											transaction={transaction}
											opacity={progress}
											y={(1 - progress) * -22}
											highlight={Math.max(
												0,
												1 - Math.abs(frame - (isIncomeDemo ? 212 : 442)) / 28,
											)}
										/>
									);
								})}
							</div>
						</div>
					</main>
				</div>

				{frame >= 50 && frame < 193 ? (
					<DemoModal frame={frame} kind="income" />
				) : null}
				{frame >= 282 && frame < 425 ? (
					<DemoModal frame={frame} kind="expense" />
				) : null}
				{frame >= 480 ? <FinalSummary frame={frame} /> : null}
				{frame < 480 ? <DemoCursor frame={frame} /> : null}
			</div>
		</AbsoluteFill>
	);
}
