"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

const FEATURES = [
	{
		icon: "💸",
		title: "Track every transaction",
		description:
			"Log income and expenses in seconds. Add a title, amount, date, and category. Every cent accounted for, nothing forgotten.",
		borderColor: "rgba(251,191,36,0.15)",
		glowColor: "rgba(251,191,36,0.06)",
	},
	{
		icon: "🏷️",
		title: "Smart categories",
		description:
			"Create custom color-coded categories with emoji icons. Slice and dice your spending exactly the way you think about money.",
		borderColor: "rgba(249,115,22,0.15)",
		glowColor: "rgba(249,115,22,0.06)",
	},
	{
		icon: "📊",
		title: "Crystal clarity",
		description:
			"See where every dollar goes at a glance. Instant totals, clean views, zero noise. Your financial picture, always sharp.",
		borderColor: "rgba(234,179,8,0.15)",
		glowColor: "rgba(234,179,8,0.06)",
	},
];

export function Features() {
	const sectionRef = useRef<HTMLElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);
	const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger);
		const ctx = gsap.context(() => {
			gsap.from(titleRef.current, {
				opacity: 0,
				y: 60,
				duration: 1,
				ease: "power3.out",
				scrollTrigger: {
					trigger: titleRef.current,
					start: "top 85%",
				},
			});

			cardsRef.current.forEach((card, i) => {
				if (!card) return;
				gsap.from(card, {
					opacity: 0,
					y: 80,
					duration: 0.9,
					delay: i * 0.12,
					ease: "power3.out",
					scrollTrigger: {
						trigger: card,
						start: "top 88%",
					},
				});
			});
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={sectionRef}
			id="features"
			className="relative bg-zinc-950 py-32"
		>
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-950/4 to-transparent" />

			<div className="relative mx-auto max-w-6xl px-6">
				<div ref={titleRef} className="mb-20 text-center">
					<p className="mb-4 font-semibold text-amber-400 text-xs uppercase tracking-widest">
						Features
					</p>
					<h2 className="mb-4 font-bold text-4xl text-white md:text-5xl">
						Everything you need to{" "}
						<span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
							master your money
						</span>
					</h2>
					<p className="mx-auto max-w-xl text-lg text-zinc-400">
						Simple, powerful tools built for people who take their finances
						seriously.
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-3">
					{FEATURES.map((feature, i) => (
						<motion.div
							key={feature.title}
							ref={(el) => {
								cardsRef.current[i] = el;
							}}
							className="group cursor-default rounded-2xl p-8 transition-all duration-500"
							style={{
								border: `1px solid ${feature.borderColor}`,
								background: `radial-gradient(ellipse at top left, ${feature.glowColor}, transparent 60%)`,
							}}
							whileHover={{ y: -10, scale: 1.02 }}
							transition={{ type: "spring", stiffness: 280, damping: 22 }}
						>
							<motion.div
								className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 text-2xl"
								whileHover={{ scale: 1.15, rotate: 5 }}
								transition={{ type: "spring", stiffness: 400 }}
							>
								{feature.icon}
							</motion.div>
							<h3 className="mb-3 font-semibold text-white text-xl">
								{feature.title}
							</h3>
							<p className="text-zinc-400 leading-relaxed">
								{feature.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
