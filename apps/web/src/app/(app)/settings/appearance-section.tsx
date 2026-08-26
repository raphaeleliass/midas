"use client";

import { Card, CardContent } from "@midas/ui/components/card";
import { cn } from "@midas/ui/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const THEME_OPTIONS = [
	{ value: "light", label: "Claro", icon: Sun },
	{ value: "dark", label: "Escuro", icon: Moon },
	{ value: "system", label: "Sistema", icon: Monitor },
] as const;

export function AppearanceSection() {
	const { theme, setTheme } = useTheme();

	return (
		<section className="space-y-3">
			<p className="px-1 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
				Aparência
			</p>
			<Card>
				<CardContent>
					<div className="grid grid-cols-3 gap-2">
						{THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
							<button
								key={value}
								type="button"
								onClick={() => setTheme(value)}
								className={cn(
									"flex flex-col items-center gap-1.5 rounded-lg py-3 font-medium text-xs transition-colors",
									theme === value
										? "bg-primary text-primary-foreground"
										: "bg-muted text-muted-foreground hover:bg-muted/80",
								)}
							>
								<Icon className="h-4 w-4" />
								{label}
							</button>
						))}
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
