import type { auth } from "@midas/auth";

export type HonoVariable = {
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null;
		userId: typeof auth.$Infer.Session.user.id | null;
	};
};
