"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { BASE } from "@/lib/finance";

type SubscriptionStatus = {
	isPremium: boolean;
	status: "active" | "expired";
	currentPeriodEnd: string | null;
};

export function useSubscription() {
	return useQuery<SubscriptionStatus>({
		queryKey: ["subscription"],
		queryFn: async () => {
			const res = await fetch(`${BASE}/billing/status`, {
				credentials: "include",
			});
			if (!res.ok) throw new Error("Falha ao carregar status da assinatura");
			return res.json();
		},
		staleTime: 5 * 60 * 1000,
	});
}

export function useCreateCheckout() {
	return useMutation({
		mutationFn: async () => {
			const res = await fetch(`${BASE}/billing/checkout`, {
				method: "POST",
				credentials: "include",
			});
			if (!res.ok) throw new Error("Falha ao criar checkout");
			const data: { checkoutUrl: string } = await res.json();
			return data;
		},
		onSuccess: ({ checkoutUrl }) => {
			window.location.href = checkoutUrl;
		},
	});
}
