import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Analytics from "./analytics";

export default async function AnalyticsPage() {
	const session = await authClient.getSession({
		fetchOptions: {
			headers: await headers(),
			throw: true,
		},
	});

	if (!session?.user) {
		redirect("/login");
	}

	return <Analytics session={session} />;
}
