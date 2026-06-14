"use client";

import gsap from "gsap";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";

const MOCK_ENTRIES = [
	{
		icon: "💼",
		label: "Salary Deposit",
		cat: "Income",
		amount: "+$3,200.00",
		positive: true,
	},
	{
		icon: "🛒",
		label: "Grocery Store",
		cat: "Food",
		amount: "-$84.20",
		positive: false,
	},
	{
		icon: "🏠",
		label: "Monthly Rent",
		cat: "Housing",
		amount: "-$1,200.00",
		positive: false,
	},
	{
		icon: "☕",
		label: "Coffee & Café",
		cat: "Lifestyle",
		amount: "-$12.50",
		positive: false,
	},
];

const BAR_HEIGHTS = [38, 62, 45, 78, 55, 90, 68, 85, 58, 95, 72, 88];

function MockDashboard() {
	return (
		<div className="relative mx-auto max-w-xl">
			<div className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-amber-400/15 to-yellow-300/10 blur-2xl" />
			<div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/90 p-6 shadow-2xl backdrop-blur-sm">
				<div className="mb-5 flex items-start justify-between">
					<div>
						<p className="mb-1 text-xs text-zinc-500">Total Balance</p>
						<p className="font-bold text-3xl text-white">$12,485.00</p>
						<p className="mt-1 text-emerald-400 text-xs">↑ +8.3% this month</p>
					</div>
					<div className="flex flex-col items-end gap-1">
						<div className="flex gap-1.5">
							<div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
							<div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
							<div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
						</div>
						<span className="mt-1 text-xs text-zinc-600">Jun 2025</span>
					</div>
				</div>

				<div className="mb-5 flex h-14 items-end gap-1">
					{BAR_HEIGHTS.map((h, i) => (
						<div
							key={i}
							className="flex-1 rounded-sm"
							style={{
								height: `${h}%`,
								background:
									i === BAR_HEIGHTS.length - 2
										? "linear-gradient(to top, #F59E0B, #FDE047)"
										: "rgba(255,255,255,0.07)",
							}}
						/>
					))}
				</div>

				<div className="space-y-3">
					{MOCK_ENTRIES.map((t) => (
						<div key={t.label} className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-sm">
									{t.icon}
								</span>
								<div>
									<p className="font-medium text-sm text-white">{t.label}</p>
									<span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
										{t.cat}
									</span>
								</div>
							</div>
							<span
								className={`font-semibold text-sm ${t.positive ? "text-emerald-400" : "text-zinc-300"}`}
							>
								{t.amount}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export function Hero() {
	const orb1 = useRef<HTMLDivElement>(null);
	const orb2 = useRef<HTMLDivElement>(null);
	const orb3 = useRef<HTMLDivElement>(null);
	const mockRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.to(orb1.current, {
				x: 40,
				y: -30,
				duration: 7,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
			});
			gsap.to(orb2.current, {
				x: -50,
				y: 35,
				duration: 9,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
				delay: 1.5,
			});
			gsap.to(orb3.current, {
				x: 25,
				y: 45,
				duration: 8,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
				delay: 3,
			});
			gsap.to(mockRef.current, {
				y: -12,
				duration: 4,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
				delay: 0.5,
			});
		});
		return () => ctx.revert();
	}, []);

	return (
		<section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 pt-16">
			{/* Ambient orbs */}
			<div
				ref={orb1}
				className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-amber-500/8 blur-[120px]"
			/>
			<div
				ref={orb2}
				className="absolute right-1/4 bottom-1/3 h-[400px] w-[400px] rounded-full bg-yellow-400/6 blur-[100px]"
			/>
			<div
				ref={orb3}
				className="absolute top-1/2 right-1/3 h-[300px] w-[300px] rounded-full bg-orange-500/6 blur-[80px]"
			/>

			{/* Subtle grid */}
			<div
				className="absolute inset-0"
				style={{
					backgroundImage:
						"linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)",
					backgroundSize: "64px 64px",
				}}
			/>

			{/* Radial vignette */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#09090B_100%)]" />

			<div className="relative z-10 mx-auto max-w-5xl px-6 pb-24 text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/5 px-4 py-1.5 font-medium text-amber-400 text-xs"
				>
					<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
					Personal Finance Tracker
				</motion.div>

				<motion.h1
					className="mb-6 font-bold text-5xl text-white leading-tight tracking-tight md:text-7xl"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.9,
						delay: 0.15,
						ease: [0.25, 0.46, 0.45, 0.94],
					}}
				>
					Your finances,{" "}
					<span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
						perfected.
					</span>
				</motion.h1>

				<motion.p
					className="mx-auto mb-10 max-w-xl text-lg text-zinc-400 leading-relaxed md:text-xl"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.3 }}
				>
					Track income and expenses with precision. Organize every dollar into
					smart categories and gain complete clarity over your financial life.
				</motion.p>

				<motion.div
					className="flex flex-col items-center justify-center gap-4 sm:flex-row"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.45 }}
				>
					<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
						<Link
							href="/login"
							className="block rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-8 py-4 font-semibold text-black shadow-amber-400/20 shadow-lg transition-opacity hover:opacity-90"
						>
							Get Started Free
						</Link>
					</motion.div>
					<motion.a
						href="#features"
						className="rounded-full border border-white/10 px-8 py-4 text-white transition-all hover:border-white/20 hover:bg-white/5"
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.97 }}
					>
						See how it works →
					</motion.a>
				</motion.div>

				<motion.div
					ref={mockRef}
					className="mt-20"
					initial={{ opacity: 0, y: 80, scale: 0.92 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{
						duration: 1.1,
						delay: 0.65,
						ease: [0.25, 0.46, 0.45, 0.94],
					}}
				>
					<MockDashboard />
				</motion.div>
			</div>

			{/* Bottom fade */}
			<div className="absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />
		</section>
	);
}
