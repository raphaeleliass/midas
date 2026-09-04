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
	month: string;
	months: string[];
	onChange: (month: string) => void;
}) {
	return (
		<Select value={month} onValueChange={(value) => value && onChange(value)}>
			<SelectTrigger aria-label="Mês das transações" className="w-full">
				{formatMonth(month).replace(" de ", " ")}
			</SelectTrigger>
			<SelectContent>
				{months.map((key) => (
					<SelectItem key={key} value={key}>
						{formatMonth(key).replace(" de ", " ")}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
