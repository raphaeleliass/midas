"use client";

import { Card, CardContent } from "@midas/ui/components/card";
import { Skeleton } from "@midas/ui/components/skeleton";
import { motion } from "motion/react";
import { centsToBrl } from "@/lib/finance";

export function BalanceCard({
	balance,
	loading,
}: {
	balance: number;
	loading: boolean;
}) {
	return (
		<Card>
			<CardContent>
				<p className="mb-1 font-medium text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
					Saldo Total
				</p>
				{loading ? (
					<Skeleton className="h-10 w-48" />
				) : (
					<motion.p
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
						className="font-bold text-[2.6rem] tabular-nums leading-none tracking-tight"
					>
						{centsToBrl(balance)}
					</motion.p>
				)}
			</CardContent>
		</Card>
	);
}
