"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@midas/ui/components/button";
import { Calendar } from "@midas/ui/components/calendar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@midas/ui/components/dialog";
import { Field, FieldError, FieldLabel } from "@midas/ui/components/field";
import { Input } from "@midas/ui/components/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@midas/ui/components/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@midas/ui/components/select";
import { cn } from "@midas/ui/lib/utils";
import { CalendarIcon, Check, Plus, Settings2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { CategoryIcon } from "@/lib/category-icons";
import { brlToCents, type Category } from "@/lib/finance";
import { useCreateEntry } from "@/lib/queries";

const entrySchema = z.object({
	type: z.enum(["Despesa", "Receita"]),
	title: z.string().min(1, "Título obrigatório"),
	amountBrl: z.string().min(1, "Informe o valor"),
	date: z.string().min(1, "Selecione uma data"),
	categoryIds: z.array(z.string()),
});

type EntryFormValues = z.infer<typeof entrySchema>;

export function EntryFormDialog({
	open,
	onOpenChange,
	categories,
	onManageCategories,
	onNewCategory,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	categories: Category[];
	onManageCategories: () => void;
	onNewCategory: () => void;
}) {
	const createEntry = useCreateEntry();
	const form = useForm<EntryFormValues>({
		resolver: zodResolver(entrySchema),
		defaultValues: {
			type: "Despesa",
			title: "",
			amountBrl: "",
			date: new Date().toISOString().split("T")[0] as string,
			categoryIds: [],
		},
	});

	async function handleSubmit(values: EntryFormValues) {
		await createEntry.mutateAsync({
			type: values.type === "Despesa" ? "expense" : "income",
			title: values.title,
			amountCents: brlToCents(values.amountBrl),
			date: new Date(`${values.date}T12:00:00`).toISOString(),
			categoryIds: values.categoryIds,
		});
		form.reset();
		onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Nova transação</DialogTitle>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
					<div className="grid grid-cols-2 gap-3">
						<Controller
							name="type"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="entry-type">Tipo</FieldLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger
											id="entry-type"
											aria-invalid={fieldState.invalid}
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Despesa">Despesa</SelectItem>
											<SelectItem value="Receita">Receita</SelectItem>
										</SelectContent>
									</Select>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="date"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="entry-date">Data</FieldLabel>
									<Popover>
										<PopoverTrigger
											id="entry-date"
											className="flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 text-left text-sm hover:bg-accent"
											aria-invalid={fieldState.invalid}
										>
											<CalendarIcon className="h-4 w-4 shrink-0 opacity-50" />
											{field.value ? (
												new Date(`${field.value}T12:00:00`).toLocaleDateString(
													"pt-BR",
													{ day: "2-digit", month: "long", year: "numeric" },
												)
											) : (
												<span className="text-muted-foreground">
													Selecionar
												</span>
											)}
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={
													field.value
														? new Date(`${field.value}T12:00:00`)
														: undefined
												}
												onSelect={(date) =>
													date &&
													field.onChange(date.toISOString().slice(0, 10))
												}
											/>
										</PopoverContent>
									</Popover>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</div>
					<Controller
						name="title"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="entry-title">Título</FieldLabel>
								<Input
									{...field}
									id="entry-title"
									placeholder="Ex: Aluguel"
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						name="amountBrl"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="entry-amount">Valor (R$)</FieldLabel>
								<Input
									{...field}
									id="entry-amount"
									placeholder="0,00"
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						name="categoryIds"
						control={form.control}
						render={({ field }) => (
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<FieldLabel>Categorias</FieldLabel>
									<div className="flex items-center gap-2">
										{categories.length > 0 && (
											<button
												type="button"
												onClick={onManageCategories}
												className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
											>
												<Settings2 className="h-3 w-3" />
												Gerenciar
											</button>
										)}
										<button
											type="button"
											onClick={onNewCategory}
											className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
										>
											<Plus className="h-3 w-3" />
											Nova
										</button>
									</div>
								</div>
								{categories.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{categories.map((category) => (
											<button
												key={category.id}
												type="button"
												onClick={() => {
													const current = field.value;
													field.onChange(
														current.includes(category.id)
															? current.filter((id) => id !== category.id)
															: [...current, category.id],
													);
												}}
												className={cn(
													"flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors",
													field.value.includes(category.id)
														? "border-primary bg-primary/10 text-primary"
														: "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
												)}
											>
												{category.icon && (
													<CategoryIcon
														iconKey={category.icon}
														className="h-3.5 w-3.5"
													/>
												)}
												{category.name}
												{field.value.includes(category.id) && (
													<Check className="h-3 w-3" />
												)}
											</button>
										))}
									</div>
								)}
							</div>
						)}
					/>
					<Button
						type="submit"
						className="w-full"
						disabled={form.formState.isSubmitting}
					>
						{form.formState.isSubmitting ? "Salvando..." : "Salvar transação"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
