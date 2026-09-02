"use client";

import { cn } from "@midas/ui/lib/utils";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { centsToBrl, type Entry, formatDate } from "@/lib/finance";
import { useEntries } from "@/lib/queries";
import { EntryIcon } from "./entry-icon";

function matchesAmount(amountCents: number, query: string): boolean {
	const formatted = centsToBrl(amountCents);
	const stripped = formatted.replace(/^R\$[\s ]*/u, "");
	const normalizedQuery = query.replace(/^R\$[\s ]*/u, "").trim();
	if (!normalizedQuery) return false;
	return stripped.startsWith(normalizedQuery);
}

function filterEntries(entries: Entry[], query: string): Entry[] {
	const q = query.trim().toLowerCase();
	if (!q) return [];
	return entries.filter(
		(entry) =>
			entry.title.toLowerCase().includes(q) ||
			(entry.subtitle ?? "").toLowerCase().includes(q) ||
			matchesAmount(entry.amountCents, query.trim()),
	);
}

interface SearchBarProps {
	onClose: () => void;
}

export function SearchBar({ onClose }: SearchBarProps) {
	const [rawQuery, setRawQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const { data: entries = [] } = useEntries();

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedQuery(rawQuery), 1000);
		return () => clearTimeout(timer);
	}, [rawQuery]);

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	useEffect(() => {
		function handleMouseDown(e: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				onClose();
			}
		}
		document.addEventListener("mousedown", handleMouseDown);
		return () => document.removeEventListener("mousedown", handleMouseDown);
	}, [onClose]);

	function handleResultClick(entry: Entry) {
		router.push(`/transactions?highlight=${entry.id}`);
		onClose();
	}

	const results = filterEntries(entries, debouncedQuery);
	const hasQuery = debouncedQuery.trim().length > 0;

	return (
		<div ref={containerRef} className="relative w-full">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.15 }}
				className="flex h-9 items-center gap-2"
			>
				<Search className="h-4 w-4 shrink-0 text-muted-foreground" />
				<input
					ref={inputRef}
					type="text"
					placeholder="Buscar transações..."
					value={rawQuery}
					onChange={(e) => setRawQuery(e.target.value)}
					className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
				/>
				<button
					type="button"
					onClick={onClose}
					aria-label="Fechar busca"
					className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
				>
					<X className="h-4 w-4" />
				</button>
			</motion.div>

			<AnimatePresence>
				{hasQuery && (
					<motion.div
						initial={{ opacity: 0, y: -6 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -6 }}
						transition={{ duration: 0.15 }}
						className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border bg-background shadow-lg"
					>
						{results.length === 0 ? (
							<p className="px-4 py-3 text-muted-foreground text-sm">
								Nenhuma transação encontrada.
							</p>
						) : (
							<ul className="max-h-80 overflow-y-auto py-1">
								{results.map((entry) => {
									const primaryCategory = entry.entryCategories[0]?.category;
									return (
										<li key={entry.id}>
											<button
												type="button"
												onClick={() => handleResultClick(entry)}
												className="flex w-full items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted"
											>
												<EntryIcon entry={entry} />
												<div className="min-w-0 flex-1 text-left">
													<p className="truncate font-medium text-sm">
														{entry.title}
													</p>
													<p className="text-[11px] text-muted-foreground">
														{formatDate(entry.date)}
														{primaryCategory
															? ` · ${primaryCategory.name}`
															: ""}
													</p>
												</div>
												<span
													className={cn(
														"shrink-0 font-semibold text-sm tabular-nums",
														entry.type === "income"
															? "text-primary"
															: "text-rose-500 dark:text-rose-400",
													)}
												>
													{entry.type === "income" ? "+" : "−"}
													{centsToBrl(entry.amountCents)}
												</span>
											</button>
										</li>
									);
								})}
							</ul>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
