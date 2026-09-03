import { redirect } from "next/navigation";
import AppSidebar from "@/components/app-sidebar";
import BottomNav from "@/components/bottom-nav";
import { getServerSession } from "@/lib/server-session";

export default async function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession();

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div className="flex h-svh">
			<AppSidebar />
			<main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>
			<BottomNav />
		</div>
	);
}
