"use client";

import { Button } from "@midas/ui/components/button";
import {
	motion,
	useMotionValueEvent,
	useReducedMotion,
	useScroll,
} from "motion/react";
import Link from "next/link";
import { useState } from "react";

const NAV_ITEMS = [
	{ href: "#product", label: "Produto" },
	{ href: "#features", label: "Recursos" },
];

export function LandingNav() {
	const [scrolled, setScrolled] = useState(false);
	const { scrollY } = useScroll();
	const reduceMotion = useReducedMotion();

	useMotionValueEvent(scrollY, "change", (value) => {
		setScrolled(value > 32);
	});

	return (
		<motion.header
			className="fixed inset-x-0 top-0 z-50 border-b"
			animate={{
				backgroundColor: scrolled
					? "color-mix(in oklch, var(--background) 92%, transparent)"
					: "color-mix(in oklch, var(--background) 0%, transparent)",
				borderColor: scrolled ? "var(--border)" : "transparent",
				backdropFilter: scrolled ? "blur(18px)" : "blur(0px)",
			}}
			transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
		>
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
				<Link
					href="/"
					className="rounded-sm font-semibold text-lg tracking-[-0.04em] outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					Midas
				</Link>

				<nav
					aria-label="Navegação principal"
					className="hidden items-center gap-7 md:flex"
				>
					{NAV_ITEMS.map((item) => (
						<a
							key={item.href}
							href={item.href}
							className="rounded-sm text-muted-foreground text-sm transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							{item.label}
						</a>
					))}
				</nav>

				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						nativeButton={false}
						render={<Link href="/login" />}
					>
						Entrar
					</Button>
				</div>
			</div>
		</motion.header>
	);
}
