"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@midas/ui/components/select";
import { formatMonth } from "@/lib/finance";

export function MonthSelector({
	month,
	months,
	onChange,
}: {
	month: string | null;
	months: string[];
	onChange: (month: string | null) => void;
}) {
	const periodLabel = month
		? formatMonth(month).replace(" de ", " ")
		: "Todo o período";

	return (
		<div className="rounded-xl border bg-card p-3 shadow-sm">
			<p className="font-medium text-sm">Período das transações</p>
			<p className="mt-0.5 text-muted-foreground text-xs">
				Exibindo receitas e despesas de{" "}
				<span className="font-medium text-foreground">{periodLabel}</span>
			</p>
			<Select
				value={month ?? "all"}
				onValueChange={(value) => onChange(value === "all" ? null : value)}
			>
				<SelectTrigger
					aria-label="Período das transações"
					className="mt-3 w-full bg-background font-medium"
				>
					{periodLabel}
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">Todo o período</SelectItem>
					{months.map((key) => (
						<SelectItem key={key} value={key}>
							{formatMonth(key).replace(" de ", " ")}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
