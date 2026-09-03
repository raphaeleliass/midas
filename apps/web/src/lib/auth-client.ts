import type { auth } from "@midas/auth";
import { adminClient, InferServerPlugin } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	plugins: [adminClient(), InferServerPlugin<typeof auth, "admin">()],
});
