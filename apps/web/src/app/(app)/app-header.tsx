"use client";

import { Bell, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { fadeUp } from "@/lib/animations";
import { SearchBar } from "./search-bar";

interface AppHeaderProps {
	title: string;
	subtitle?: string;
	showBell?: boolean;
}

export function AppHeader({
	title,
	subtitle,
	showBell = true,
}: AppHeaderProps) {
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	return (
		<motion.header variants={fadeUp} className="relative py-1">
			<AnimatePresence mode="wait">
				{isSearchOpen ? (
					<SearchBar key="search" onClose={() => setIsSearchOpen(false)} />
				) : (
					<motion.div
						key="normal"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15 }}
						className="grid grid-cols-3 items-center"
					>
						<button
							type="button"
							onClick={() => setIsSearchOpen(true)}
							className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							aria-label="Buscar"
						>
							<Search className="h-4 w-4" />
						</button>
						<div className="flex flex-col items-center">
							<p className="font-semibold text-sm tracking-tight">{title}</p>
							{subtitle && (
								<p className="text-[11px] text-muted-foreground">{subtitle}</p>
							)}
						</div>
						<div className="flex justify-end">
							{showBell && (
								<button
									type="button"
									className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
									aria-label="Notificações"
								>
									<Bell className="h-4 w-4" />
								</button>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.header>
	);
}
