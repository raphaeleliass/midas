"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useState } from "react";

export function LandingNav() {
	const [scrolled, setScrolled] = useState(false);
	const { scrollY } = useScroll();

	useMotionValueEvent(scrollY, "change", (y) => {
		setScrolled(y > 40);
	});

	return (
		<motion.header
			className="fixed top-0 right-0 left-0 z-50"
			style={{
				backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
				backgroundColor: scrolled ? "rgba(9,9,11,0.8)" : "transparent",
				borderBottom: scrolled
					? "1px solid rgba(255,255,255,0.06)"
					: "1px solid transparent",
				transition:
					"backdrop-filter 0.4s ease, background-color 0.4s ease, border-color 0.4s ease",
			}}
		>
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
				<Link href="/" className="flex select-none items-center gap-1">
					<span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text font-black text-2xl text-transparent">
						M
					</span>
					<span className="font-semibold text-white text-xl">idas</span>
				</Link>

				<nav className="hidden items-center gap-8 md:flex">
					{[
						{ href: "#features", label: "Features" },
						{ href: "#how-it-works", label: "How it works" },
					].map(({ href, label }) => (
						<a
							key={href}
							href={href}
							className="text-sm text-zinc-400 transition-colors hover:text-white"
						>
							{label}
						</a>
					))}
				</nav>

				<div className="flex items-center gap-3">
					<Link
						href="/login"
						className="text-sm text-zinc-400 transition-colors hover:text-white"
					>
						Sign in
					</Link>
					<motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
						<Link
							href="/login"
							className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-4 py-2 font-semibold text-black text-sm transition-opacity hover:opacity-90"
						>
							Get Started
						</Link>
					</motion.div>
				</div>
			</div>
		</motion.header>
	);
}
