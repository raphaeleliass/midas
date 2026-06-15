"use client";

import { cn } from "@midas/ui/lib/utils";
import {
	ArrowLeftRight,
	LayoutDashboard,
	Settings,
	TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
	{ href: "/dashboard", label: "Início", icon: LayoutDashboard },
	{ href: "/transactions", label: "Transações", icon: ArrowLeftRight },
	{ href: "/analytics", label: "Análises", icon: TrendingUp },
	{ href: "/settings", label: "Config.", icon: Settings },
] as const;

export default function BottomNav() {
	const pathname = usePathname();

	return (
		<nav className="fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-around border-t bg-background/80 backdrop-blur-md md:hidden">
			{items.map(({ href, label, icon: Icon }) => {
				const active = pathname === href || pathname.startsWith(`${href}/`);
				return (
					<Link
						key={href}
						href={href}
						className="relative flex flex-col items-center gap-1 px-3 py-1"
					>
						<Icon
							className={cn(
								"h-5 w-5 transition-colors",
								active ? "text-foreground" : "text-muted-foreground",
							)}
						/>
						<span
							className={cn(
								"text-[10px] transition-colors",
								active
									? "font-medium text-foreground"
									: "text-muted-foreground",
							)}
						>
							{label}
						</span>
						<AnimatePresence>
							{active && (
								<motion.span
									layoutId="bottom-nav-dot"
									className="absolute -bottom-1 h-1 w-1 rounded-full bg-foreground"
									initial={{ opacity: 0, scale: 0 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0 }}
									transition={{ duration: 0.2 }}
								/>
							)}
						</AnimatePresence>
					</Link>
				);
			})}
		</nav>
	);
}
