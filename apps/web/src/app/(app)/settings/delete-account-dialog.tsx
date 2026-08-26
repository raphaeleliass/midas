"use client";

import { Button } from "@midas/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@midas/ui/components/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type DeleteAccountDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function DeleteAccountDialog({
	open,
	onOpenChange,
}: DeleteAccountDialogProps) {
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);

	async function handleDelete() {
		setIsPending(true);
		const { error } = await authClient.deleteUser();
		setIsPending(false);

		if (error) {
			toast.error(error.message ?? "Erro ao excluir conta.");
			return;
		}

		router.push("/login");
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Excluir conta</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 pt-2">
					<p className="text-muted-foreground text-sm">
						Tem certeza? Essa ação é permanente e irá apagar todos os seus
						dados, transações e histórico. Não é possível desfazê-la.
					</p>
					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancelar
						</Button>
						<Button
							type="button"
							variant="destructive"
							onClick={handleDelete}
							disabled={isPending}
						>
							{isPending ? "Excluindo..." : "Excluir conta"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
