import Link from "next/link";

export function Footer() {
	return (
		<footer className="border-white/5 border-t bg-zinc-950 py-12">
			<div className="mx-auto max-w-6xl px-6">
				<div className="flex flex-col items-center justify-between gap-6 md:flex-row">
					<div>
						<Link href="/" className="flex select-none items-center gap-1">
							<span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text font-black text-transparent text-xl">
								M
							</span>
							<span className="font-semibold text-lg text-white">idas</span>
						</Link>
						<p className="mt-1.5 text-sm text-zinc-600">
							Turn your finances to gold.
						</p>
					</div>

					<nav className="flex gap-6">
						{[
							{ href: "/login", label: "Sign In" },
							{ href: "/dashboard", label: "Dashboard" },
							{ href: "#features", label: "Features" },
						].map(({ href, label }) => (
							<Link
								key={href}
								href={href}
								className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
							>
								{label}
							</Link>
						))}
					</nav>
				</div>

				<div className="mt-8 border-white/5 border-t pt-8 text-center text-xs text-zinc-700">
					© {new Date().getFullYear()} Midas. All rights reserved.
				</div>
			</div>
		</footer>
	);
}
