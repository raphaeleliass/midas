"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

const STEPS = [
	{
		number: "01",
		icon: "✨",
		title: "Create your account",
		description:
			"Sign up in seconds. No credit card, no complex onboarding. Just you and your finances.",
	},
	{
		number: "02",
		icon: "📝",
		title: "Log your transactions",
		description:
			"Add income and expenses as they happen. Set a title, amount, category, and date in one clean flow.",
	},
	{
		number: "03",
		icon: "🎯",
		title: "Gain complete clarity",
		description:
			"Your financial picture crystallizes instantly. Know exactly where you stand, every single day.",
	},
];

export function Steps() {
	const sectionRef = useRef<HTMLElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);
	const lineRef = useRef<HTMLDivElement>(null);
	const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger);
		const ctx = gsap.context(() => {
			gsap.from(titleRef.current, {
				opacity: 0,
				y: 50,
				duration: 1,
				ease: "power3.out",
				scrollTrigger: { trigger: titleRef.current, start: "top 85%" },
			});

			gsap.from(lineRef.current, {
				scaleX: 0,
				transformOrigin: "left center",
				duration: 1.5,
				ease: "power2.inOut",
				scrollTrigger: { trigger: lineRef.current, start: "top 80%" },
			});

			stepsRef.current.forEach((step, i) => {
				if (!step) return;
				gsap.from(step, {
					opacity: 0,
					y: 60,
					duration: 0.8,
					delay: i * 0.2,
					ease: "power3.out",
					scrollTrigger: { trigger: step, start: "top 85%" },
				});
			});
		}, sectionRef);
		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={sectionRef}
			id="how-it-works"
			className="relative bg-zinc-950 py-32"
		>
			<div className="mx-auto max-w-5xl px-6">
				<div ref={titleRef} className="mb-20 text-center">
					<p className="mb-4 font-semibold text-amber-400 text-xs uppercase tracking-widest">
						How it works
					</p>
					<h2 className="font-bold text-4xl text-white md:text-5xl">
						Three steps to{" "}
						<span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
							financial clarity
						</span>
					</h2>
				</div>

				<div className="relative">
					{/* Connector line — desktop only */}
					<div className="absolute top-10 right-16 left-16 hidden h-px md:block">
						<div className="h-full w-full rounded-full bg-gradient-to-r from-amber-400/30 via-yellow-300/20 to-amber-400/30" />
						<div
							ref={lineRef}
							className="absolute inset-0 h-full w-full origin-left rounded-full bg-gradient-to-r from-amber-400/60 to-yellow-300/60"
						/>
					</div>

					<div className="grid gap-10 md:grid-cols-3">
						{STEPS.map((step, i) => (
							<motion.div
								key={step.number}
								ref={(el) => {
									stepsRef.current[i] = el;
								}}
								className="group relative text-center"
								whileHover={{ y: -6 }}
								transition={{ type: "spring", stiffness: 300, damping: 24 }}
							>
								{/* Step circle */}
								<div className="relative mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border border-amber-400/20 bg-zinc-900">
									<span className="text-3xl">{step.icon}</span>
									<div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 font-black text-black text-xs">
										{i + 1}
									</div>
								</div>
								<h3 className="mb-3 font-semibold text-white text-xl">
									{step.title}
								</h3>
								<p className="text-zinc-400 leading-relaxed">
									{step.description}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
