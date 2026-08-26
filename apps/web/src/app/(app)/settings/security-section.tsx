"use client";

import { Card } from "@midas/ui/components/card";
import { ChevronRight, KeyRound, Trash2 } from "lucide-react";
import { useState } from "react";
import { ChangePasswordDialog } from "./change-password-dialog";
import { DeleteAccountDialog } from "./delete-account-dialog";

type SecurityRow = {
	icon: React.ReactNode;
	label: string;
	onClick: () => void;
	destructive?: boolean;
};

export function SecuritySection() {
	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
	const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

	const rows: SecurityRow[] = [
		{
			icon: <KeyRound className="h-4 w-4 text-muted-foreground" />,
			label: "Alterar senha",
			onClick: () => setIsChangePasswordOpen(true),
		},
		{
			icon: <Trash2 className="h-4 w-4 text-destructive" />,
			label: "Excluir conta",
			onClick: () => setIsDeleteAccountOpen(true),
			destructive: true,
		},
	];

	return (
		<>
			<section className="space-y-3">
				<p className="px-1 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
					Segurança
				</p>
				<Card className="gap-0 [--card-spacing:0]">
					<div className="divide-y divide-border">
						{rows.map((row) => (
							<button
								key={row.label}
								type="button"
								onClick={row.onClick}
								className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors first:rounded-t-[inherit] last:rounded-b-[inherit] hover:bg-muted/50"
							>
								{row.icon}
								<span
									className={`flex-1 font-medium text-sm ${row.destructive ? "text-destructive" : ""}`}
								>
									{row.label}
								</span>
								<ChevronRight className="h-4 w-4 text-muted-foreground" />
							</button>
						))}
					</div>
				</Card>
			</section>

			<ChangePasswordDialog
				open={isChangePasswordOpen}
				onOpenChange={setIsChangePasswordOpen}
			/>
			<DeleteAccountDialog
				open={isDeleteAccountOpen}
				onOpenChange={setIsDeleteAccountOpen}
			/>
		</>
	);
}
