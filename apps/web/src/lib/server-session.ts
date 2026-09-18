import { env } from "@midas/env/web";
import { headers } from "next/headers";
import { authClient } from "./auth-client";

export async function getServerSession() {
	const requestHeaders = await headers();
	// In remote development, the public URL points back to this Next server through
	// ngrok. Server-rendered requests should call the local API directly instead.
	const serverUrl =
		process.env.NODE_ENV === "development"
			? "http://127.0.0.1:3000"
			: env.NEXT_PUBLIC_SERVER_URL.replace(/\/$/, "");

	return authClient.getSession({
		fetchOptions: {
			baseURL: `${serverUrl}/api/auth`,
			headers: { cookie: requestHeaders.get("cookie") ?? "" },
			throw: true,
		},
	});
}
