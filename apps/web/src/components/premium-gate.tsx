"use client";

import type { ReactNode } from "react";
import { useSubscription } from "@/lib/hooks/use-subscription";

type PremiumGateProps = {
	children: ReactNode;
	fallback: ReactNode;
};

export function PremiumGate({ children, fallback }: PremiumGateProps) {
	const { data, isLoading } = useSubscription();

	if (isLoading) return null;
	if (data?.isPremium) return <>{children}</>;
	return <>{fallback}</>;
}
