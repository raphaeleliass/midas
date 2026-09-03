import { env } from "@midas/env/web";
import { headers } from "next/headers";
import { authClient } from "./auth-client";

export async function getServerSession() {
	const requestHeaders = await headers();
	const serverUrl = env.NEXT_PUBLIC_SERVER_URL.replace(/\/$/, "");

	return authClient.getSession({
		fetchOptions: {
			baseURL: `${serverUrl}/api/auth`,
			headers: { cookie: requestHeaders.get("cookie") ?? "" },
			throw: true,
		},
	});
}
