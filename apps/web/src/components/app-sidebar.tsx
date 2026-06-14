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
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

const items = [
	{ href: "/dashboard", label: "Início", icon: LayoutDashboard },
	{ href: "/transactions", label: "Transações", icon: ArrowLeftRight },
	{ href: "/analytics", label: "Análises", icon: TrendingUp },
	{ href: "/settings", label: "Configurações", icon: Settings },
] as const;

export default function AppSidebar() {
	const pathname = usePathname();

	return (
		<aside className="hidden w-56 shrink-0 flex-col border-r bg-background md:flex">
			<div className="flex h-14 items-center border-b px-5">
				<span className="font-semibold text-lg tracking-tight">Midas</span>
			</div>
			<nav className="flex-1 space-y-0.5 p-3">
				{items.map(({ href, label, icon: Icon }) => {
					const active = pathname === href || pathname.startsWith(`${href}/`);
					return (
						<Link
							key={href}
							href={href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
								active
									? "bg-accent font-medium text-accent-foreground"
									: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
							)}
						>
							<Icon className="h-4 w-4 shrink-0" />
							{label}
						</Link>
					);
				})}
			</nav>
			<div className="flex items-center justify-between border-t p-3">
				<UserMenu />
				<ModeToggle />
			</div>
		</aside>
	);
}
