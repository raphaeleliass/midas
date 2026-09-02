import { env } from "@midas/env/server";
import { auth } from "./index.js";

const password = process.env.INITIAL_ADMIN_PASSWORD;
const name = process.env.INITIAL_ADMIN_NAME ?? "Administrator";
const email = env.INITIAL_ADMIN_EMAILS[0];

if (
	env.INITIAL_ADMIN_EMAILS.length !== 1 ||
	!email ||
	!password ||
	password.length < 12
) {
	throw new Error(
		"Set exactly one INITIAL_ADMIN_EMAILS value and an INITIAL_ADMIN_PASSWORD with at least 12 characters.",
	);
}

const context = await auth.$context;

if (await context.internalAdapter.findUserByEmail(email)) {
	throw new Error("The initial administrator already exists.");
}

const user = await context.internalAdapter.createUser({
	email,
	name,
	role: "admin",
	emailVerified: true,
});

if (!user) throw new Error("Failed to create the initial administrator.");

await context.internalAdapter.linkAccount({
	accountId: user.id,
	providerId: "credential",
	password: await context.password.hash(password),
	userId: user.id,
});

console.log(`Initial administrator created: ${email}`);
