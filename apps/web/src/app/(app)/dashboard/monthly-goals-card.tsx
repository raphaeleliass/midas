"use client";

import { Button } from "@midas/ui/components/button";
import { Card, CardContent } from "@midas/ui/components/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@midas/ui/components/dialog";
import { Input } from "@midas/ui/components/input";
import { Label } from "@midas/ui/components/label";
import { Progress } from "@midas/ui/components/progress";
import { cn } from "@midas/ui/lib/utils";
import { Pencil, PiggyBank, Plus } from "lucide-react";
import { useState } from "react";
import { applyAmountMask, brlToCents, centsToBrl, type MonthlyGoals } from "@/lib/finance";
import { useUpdateMonthlyGoals } from "@/lib/queries";

type GoalType = "expense" | "income";

function GoalRow({
	type,
	target,
	amount,
	loading,
	onEdit,
}: {
	type: GoalType;
	target: number | null;
	amount: number;
	loading: boolean;
	onEdit: (type: GoalType) => void;
}) {
	const isExpense = type === "expense";
	const progress = target ? Math.min(100, (amount / target) * 100) : 0;
	const difference = target ? target - amount : 0;
	const status = isExpense
		? difference > 0
			? `${centsToBrl(difference)} disponíveis`
			: difference === 0
				? "Limite atingido"
				: `${centsToBrl(Math.abs(difference))} acima do limite`
		: difference > 0
			? `Faltam ${centsToBrl(difference)}`
			: "Meta alcançada";

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between gap-3">
				<div>
					<p className="font-medium text-sm">{isExpense ? "Gastos" : "Receitas"}</p>
					{target ? (
						<p className={cn("text-xs", difference < 0 && isExpense ? "text-destructive" : "text-muted-foreground")}>
							{loading ? "—" : status}
						</p>
					) : (
						<p className="text-xs text-muted-foreground">Defina sua meta mensal</p>
					)}
				</div>
				<Button variant="ghost" size="sm" onClick={() => onEdit(type)}>
					{target ? <Pencil className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
					<span className="ml-1">{target ? "Editar" : "Criar"}</span>
				</Button>
			</div>
			{target && (
				<>
					<div className="flex items-center justify-between text-xs tabular-nums">
						<span>{loading ? "—" : centsToBrl(amount)}</span>
						<span className="text-muted-foreground">de {centsToBrl(target)}</span>
					</div>
					<Progress
						value={progress}
						className={cn(
							"h-2",
							isExpense && difference < 0
								? "[&_[data-slot='progress-indicator']]:bg-destructive"
								: "[&_[data-slot='progress-indicator']]:bg-primary",
						)}
					/>
				</>
			)}
		</div>
	);
}

export function MonthlyGoalsCard({
	goals,
	monthExpense,
	monthIncome,
	loading,
}: {
	goals: MonthlyGoals | undefined;
	monthExpense: number;
	monthIncome: number;
	loading: boolean;
}) {
	const updateGoals = useUpdateMonthlyGoals();
	const [editing, setEditing] = useState<GoalType | null>(null);
	const [amount, setAmount] = useState("");
	const target = editing === "expense" ? goals?.expenseTargetCents : goals?.incomeTargetCents;

	function openEditor(type: GoalType) {
		setEditing(type);
		const current = type === "expense" ? goals?.expenseTargetCents : goals?.incomeTargetCents;
		setAmount(current ? applyAmountMask(String(current)) : "");
	}

	async function save() {
		if (!editing || brlToCents(amount) <= 0) return;
		await updateGoals.mutateAsync({
			[editing === "expense" ? "expenseTargetCents" : "incomeTargetCents"]: brlToCents(amount),
		});
		setEditing(null);
	}

	async function remove() {
		if (!editing) return;
		await updateGoals.mutateAsync({
			[editing === "expense" ? "expenseTargetCents" : "incomeTargetCents"]: null,
		});
		setEditing(null);
	}

	return (
		<>
			<Card>
				<CardContent className="space-y-5">
					<div className="flex items-center gap-3">
						<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
							<PiggyBank className="h-4 w-4 text-primary" />
						</div>
						<div>
							<p className="font-medium text-[10px] text-muted-foreground uppercase tracking-[0.1em]">Metas do mês</p>
							<p className="font-semibold text-sm">Acompanhe seu planejamento</p>
						</div>
					</div>
					<GoalRow type="expense" target={goals?.expenseTargetCents ?? null} amount={monthExpense} loading={loading} onEdit={openEditor} />
					<GoalRow type="income" target={goals?.incomeTargetCents ?? null} amount={monthIncome} loading={loading} onEdit={openEditor} />
				</CardContent>
			</Card>
			<Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>{target ? "Editar" : "Criar"} meta de {editing === "expense" ? "gastos" : "receitas"}</DialogTitle>
					</DialogHeader>
					<form onSubmit={(event) => { event.preventDefault(); save(); }} className="space-y-4">
						<div className="space-y-1.5">
							<Label htmlFor="goal-amount">Valor mensal (R$)</Label>
							<Input id="goal-amount" value={amount} onChange={(event) => setAmount(applyAmountMask(event.target.value))} placeholder="0,00" inputMode="numeric" autoFocus />
							{amount && brlToCents(amount) <= 0 && <p className="text-xs text-destructive">Informe um valor maior que zero.</p>}
							{updateGoals.error && <p className="text-xs text-destructive">Não foi possível salvar a meta. Tente novamente.</p>}
						</div>
						<div className="flex justify-between gap-2">
							{target ? <Button type="button" variant="ghost" className="text-destructive hover:text-destructive" onClick={remove} disabled={updateGoals.isPending}>Remover</Button> : <span />}
							<Button type="submit" disabled={updateGoals.isPending || brlToCents(amount) <= 0}>{updateGoals.isPending ? "Salvando..." : "Salvar meta"}</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
