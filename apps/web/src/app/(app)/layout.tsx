import AppSidebar from "@/components/app-sidebar";
import BottomNav from "@/components/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-svh">
			<AppSidebar />
			<main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>
			<BottomNav />
		</div>
	);
}
