import { spawn } from "node:child_process";
import { config } from "dotenv";

config({ path: new URL("../apps/server/.env", import.meta.url), quiet: true });

if (!process.env.NGROK_AUTHTOKEN) {
	console.error(
		"NGROK_AUTHTOKEN não está definido em apps/server/.env. Adicione seu token e tente novamente.",
	);
	process.exit(1);
}

const processes = [];
let stopping = false;

function stop(exitCode = 0) {
	if (stopping) return;
	stopping = true;

	for (const child of processes) {
		if (!child.killed) child.kill("SIGTERM");
	}

	process.exit(exitCode);
}

function start(command, args, options = {}) {
	const child = spawn(command, args, {
		cwd: new URL("..", import.meta.url),
		stdio: "inherit",
		...options,
	});

	processes.push(child);
	child.on("error", (error) => {
		console.error(`Não foi possível iniciar ${command}: ${error.message}`);
		stop(1);
	});

	return child;
}

async function getPublicUrl() {
	for (let attempt = 0; attempt < 30; attempt += 1) {
		try {
			const response = await fetch("http://127.0.0.1:4040/api/tunnels");
			const { tunnels } = await response.json();
			const httpsTunnel = tunnels.find((tunnel) =>
				tunnel.public_url.startsWith("https://"),
			);

			if (httpsTunnel) return httpsTunnel.public_url;
		} catch {
			// O inspetor local do ngrok ainda não está pronto.
		}

		await new Promise((resolve) => setTimeout(resolve, 500));
	}

	throw new Error("Não foi possível obter a URL pública do ngrok.");
}

process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());

const ngrok = start("ngrok", ["http", "3001"]);
ngrok.on("exit", (code) => {
	if (!stopping) {
		console.error(`O ngrok foi encerrado (código ${code ?? "desconhecido"}).`);
		stop(1);
	}
});

try {
	const publicUrl = await getPublicUrl();
	console.log(`\nAmbiente remoto disponível em: ${publicUrl}\n`);

	const dev = start("pnpm", ["exec", "turbo", "run", "dev"], {
		env: {
			...process.env,
			BETTER_AUTH_URL: publicUrl,
			CORS_ORIGIN: publicUrl,
			NEXT_PUBLIC_SERVER_URL: publicUrl,
		},
	});

	dev.on("exit", (code) => stop(code ?? 0));
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	stop(1);
}
