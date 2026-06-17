import { Bell, Search } from "lucide-react";
import { motion } from "motion/react";
import { fadeUp } from "@/lib/animations";

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
	return (
		<motion.header
			variants={fadeUp}
			className="grid grid-cols-3 items-center py-1"
		>
			<button
				type="button"
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
		</motion.header>
	);
}
