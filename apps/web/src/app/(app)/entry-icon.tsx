import { cn } from "@midas/ui/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import { CategoryIcon } from "@/lib/category-icons";
import type { Entry } from "@/lib/finance";

export function EntryIcon({ entry }: { entry: Entry }) {
	const primaryCategory = entry.entryCategories[0]?.category;
	return (
		<div
			className={cn(
				"flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
				primaryCategory?.icon
					? "bg-muted text-foreground"
					: entry.type === "income"
						? "bg-primary/10 text-primary"
						: "bg-rose-500/10 text-rose-500",
			)}
		>
			{primaryCategory?.icon ? (
				<CategoryIcon iconKey={primaryCategory.icon} className="h-4 w-4" />
			) : entry.type === "income" ? (
				<TrendingUp className="h-4 w-4" />
			) : (
				<TrendingDown className="h-4 w-4" />
			)}
		</div>
	);
}
