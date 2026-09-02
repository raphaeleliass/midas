"use client";

import { Card } from "@midas/ui/components/card";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { EditFieldDialog } from "./edit-field-dialog";

type User = {
	name: string;
	email: string;
};

type AccountSectionProps = {
	user: User;
};

export function AccountSection({ user }: AccountSectionProps) {
	const [localName, setLocalName] = useState(user.name);
	const [localEmail, setLocalEmail] = useState(user.email);
	const [editingField, setEditingField] = useState<"name" | "email" | null>(
		null,
	);

	const rows = [
		{
			field: "name" as const,
			label: "Nome",
			value: localName,
		},
		{
			field: "email" as const,
			label: "E-mail",
			value: localEmail,
		},
	];

	function handleSuccess(field: "name" | "email", newValue: string) {
		if (field === "name") setLocalName(newValue);
		else setLocalEmail(newValue);
	}

	return (
		<>
			<section className="space-y-3">
				<p className="px-1 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
					Conta
				</p>
				<Card className="gap-0 [--card-spacing:0]">
					<div className="divide-y divide-border">
						{rows.map((row) => (
							<button
								key={row.field}
								type="button"
								onClick={() => setEditingField(row.field)}
								className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors first:rounded-t-[inherit] last:rounded-b-[inherit] hover:bg-muted/50"
							>
								<span className="flex-1 font-medium text-sm">{row.label}</span>
								<span className="max-w-[55%] truncate text-muted-foreground text-sm">
									{row.value}
								</span>
								<ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
							</button>
						))}
					</div>
				</Card>
			</section>

			{rows.map((row) => (
				<EditFieldDialog
					key={row.field}
					open={editingField === row.field}
					onOpenChange={(open) => !open && setEditingField(null)}
					field={row.field}
					label={row.label}
					currentValue={row.value}
					onSuccess={(newValue) => handleSuccess(row.field, newValue)}
				/>
			))}
		</>
	);
}
