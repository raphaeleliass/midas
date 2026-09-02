import type { auth } from "@midas/auth";
import { env } from "@midas/env/web";
import { adminClient, InferServerPlugin } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: env.NEXT_PUBLIC_SERVER_URL,
	plugins: [adminClient(), InferServerPlugin<typeof auth, "admin">()],
});
