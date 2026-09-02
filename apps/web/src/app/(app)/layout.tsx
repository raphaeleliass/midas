import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AppSidebar from "@/components/app-sidebar";
import BottomNav from "@/components/bottom-nav";
import { authClient } from "@/lib/auth-client";

export default async function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const requestHeaders = await headers();
	const session = await authClient.getSession({
		fetchOptions: {
			headers: { cookie: requestHeaders.get("cookie") ?? "" },
			throw: true,
		},
	});

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
