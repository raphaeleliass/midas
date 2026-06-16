type Period = "week" | "month" | "year";

const periods: { key: Period; label: string }[] = [
	{ key: "week", label: "Semana" },
	{ key: "month", label: "Mês" },
	{ key: "year", label: "Ano" },
];

export function PeriodSelector({
	period,
	onChange,
}: {
	period: Period;
	onChange: (period: Period) => void;
}) {
	return (
		<div className="flex gap-1 rounded-xl bg-muted p-1">
			{periods.map(({ key, label }) => (
				<button
					key={key}
					type="button"
					onClick={() => onChange(key)}
					className={`flex-1 rounded-lg py-1.5 font-medium text-sm transition-all ${
						period === key
							? "bg-foreground text-background shadow-sm"
							: "text-muted-foreground hover:text-foreground"
					}`}
				>
					{label}
				</button>
			))}
		</div>
	);
}

export type { Period };
