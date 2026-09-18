import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE, type Category, type Entry, type MonthlyGoals } from "./finance";

export function useMonthlyGoals() {
	return useQuery<MonthlyGoals>({
		queryKey: ["monthly-goals"],
		queryFn: async () => {
			const res = await fetch(`${BASE}/goals`, { credentials: "include" });
			if (!res.ok) throw new Error("Falha ao carregar metas");
			return res.json();
		},
	});
}

export function useUpdateMonthlyGoals() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: Partial<MonthlyGoals>) => {
			const res = await fetch(`${BASE}/goals`, {
				method: "PATCH",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) throw new Error("Falha ao salvar meta");
			return res.json();
		},
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["monthly-goals"] }),
	});
}

export function useEntries() {
	return useQuery<Entry[]>({
		queryKey: ["entries"],
		queryFn: async () => {
			const res = await fetch(`${BASE}/entries`, { credentials: "include" });
			if (!res.ok) throw new Error("Falha ao carregar lançamentos");
			return res.json();
		},
		staleTime: 5 * 60 * 1000,
	});
}

export function useCalendarEntries(month: string) {
	return useQuery<Entry[]>({
		queryKey: ["calendar-entries", month],
		queryFn: async () => {
			const res = await fetch(`${BASE}/entries/calendar?month=${month}`, {
				credentials: "include",
			});
			if (!res.ok) throw new Error("Falha ao carregar calendário");
			return res.json();
		},
	});
}

export function useCategories() {
	return useQuery<Category[]>({
		queryKey: ["categories"],
		queryFn: async () => {
			const res = await fetch(`${BASE}/categories`, { credentials: "include" });
			if (!res.ok) throw new Error("Falha ao carregar categorias");
			return res.json();
		},
		staleTime: 5 * 60 * 1000,
	});
}

type CreateEntryInput = {
	type: "expense" | "income";
	title: string;
	amountCents: number;
	date: string;
	categoryIds: string[];
};

type UpdateEntryInput = CreateEntryInput & { id: string };

type CreateCategoryInput = { name: string; icon: string | null };

type UpdateCategoryInput = CreateCategoryInput & { id: string };

export function useCreateEntry() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: CreateEntryInput) => {
			const res = await fetch(`${BASE}/entries`, {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) throw new Error("Falha ao criar lançamento");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["entries"] });
			queryClient.invalidateQueries({ queryKey: ["calendar-entries"] });
		},
	});
}

export function useUpdateEntry() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, ...data }: UpdateEntryInput) => {
			const res = await fetch(`${BASE}/entries/${id}`, {
				method: "PATCH",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) throw new Error("Falha ao atualizar lançamento");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["entries"] });
			queryClient.invalidateQueries({ queryKey: ["calendar-entries"] });
		},
	});
}

export function useDeleteEntry() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await fetch(`${BASE}/entries/${id}`, {
				method: "DELETE",
				credentials: "include",
			});
			if (!res.ok) throw new Error("Falha ao excluir lançamento");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["entries"] });
			queryClient.invalidateQueries({ queryKey: ["calendar-entries"] });
		},
	});
}

export function useCreateCategory() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: CreateCategoryInput) => {
			const res = await fetch(`${BASE}/categories`, {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) throw new Error("Falha ao criar categoria");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			queryClient.invalidateQueries({ queryKey: ["entries"] });
		},
	});
}

export function useUpdateCategory() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, ...data }: UpdateCategoryInput) => {
			const res = await fetch(`${BASE}/categories/${id}`, {
				method: "PATCH",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) throw new Error("Falha ao atualizar categoria");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			queryClient.invalidateQueries({ queryKey: ["entries"] });
		},
	});
}

export function useDeleteCategory() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await fetch(`${BASE}/categories/${id}`, {
				method: "DELETE",
				credentials: "include",
			});
			if (!res.ok) throw new Error("Falha ao excluir categoria");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			queryClient.invalidateQueries({ queryKey: ["entries"] });
		},
	});
}
