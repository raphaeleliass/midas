"use client";

import { cn } from "@midas/ui/lib/utils";
import {
	ArrowLeftRight,
	LayoutDashboard,
	Settings,
	TrendingUp,
} from "lucide-react";
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
		<nav className="fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-around border-t bg-background md:hidden">
			{items.map(({ href, label, icon: Icon }) => {
				const active = pathname === href || pathname.startsWith(`${href}/`);
				return (
					<Link
						key={href}
						href={href}
						className={cn(
							"flex flex-col items-center gap-1 text-xs transition-colors",
							active ? "text-foreground" : "text-muted-foreground",
						)}
					>
						<Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
						<span>{label}</span>
					</Link>
				);
			})}
		</nav>
	);
}
