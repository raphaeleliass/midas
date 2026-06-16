import { Button } from "@midas/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@midas/ui/components/dialog";
import { Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { CategoryIcon } from "@/lib/category-icons";
import type { Category } from "@/lib/finance";

export function ManageCategoriesDialog({
	open,
	onOpenChange,
	categories,
	onEdit,
	onDelete,
	onNew,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	categories: Category[];
	onEdit: (cat: Category) => void;
	onDelete: (id: string) => void;
	onNew: () => void;
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-sm">
				<DialogHeader>
					<DialogTitle>Categorias</DialogTitle>
				</DialogHeader>
				<div className="max-h-72 space-y-1 overflow-y-auto">
					{categories.length === 0 ? (
						<p className="py-6 text-center text-muted-foreground text-sm">
							Nenhuma categoria criada.
						</p>
					) : (
						categories.map((cat) => (
							<div
								key={cat.id}
								className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted"
							>
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
									{cat.icon ? (
										<CategoryIcon iconKey={cat.icon} className="h-4 w-4" />
									) : (
										<Tag className="h-4 w-4" />
									)}
								</div>
								<span className="flex-1 text-sm">{cat.name}</span>
								<button
									type="button"
									title="Editar"
									onClick={() => {
										onOpenChange(false);
										onEdit(cat);
									}}
									className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
								>
									<Pencil className="h-3.5 w-3.5" />
								</button>
								<button
									type="button"
									title="Excluir"
									onClick={() => onDelete(cat.id)}
									className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-rose-500"
								>
									<Trash2 className="h-3.5 w-3.5" />
								</button>
							</div>
						))
					)}
				</div>
				<Button
					variant="outline"
					className="w-full"
					onClick={() => {
						onOpenChange(false);
						onNew();
					}}
				>
					<Plus className="h-4 w-4" />
					Nova categoria
				</Button>
			</DialogContent>
		</Dialog>
	);
}
