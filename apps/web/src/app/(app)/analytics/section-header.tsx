export function SectionHeader({ label }: { label: string }) {
	return (
		<div className="flex items-center gap-3">
			<span className="font-semibold text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
				{label}
			</span>
			<div className="h-px flex-1 bg-border" />
		</div>
	);
}
