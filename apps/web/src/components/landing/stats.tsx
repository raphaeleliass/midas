"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

const STATS = [
	{
		value: 5,
		suffix: "s",
		label: "to log an entry",
		description: "The fastest way to capture any transaction",
	},
	{
		value: 100,
		suffix: "%",
		label: "your data",
		description: "Private, secure, and always in your control",
	},
	{
		value: 0,
		suffix: " fees",
		label: "hidden costs",
		description: "Transparent, simple, no subscriptions",
	},
];

function StatCard({
	value,
	suffix,
	label,
	description,
	index,
}: (typeof STATS)[0] & { index: number }) {
	const valueRef = useRef<HTMLSpanElement>(null);
	const cardRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger);
		const ctx = gsap.context(() => {
			gsap.from(cardRef.current, {
				opacity: 0,
				y: 50,
				duration: 0.8,
				delay: index * 0.15,
				ease: "power3.out",
				scrollTrigger: {
					trigger: cardRef.current,
					start: "top 85%",
				},
			});

			if (value > 0) {
				gsap.from(
					{ n: 0 },
					{
						n: value,
						duration: 1.8,
						delay: index * 0.15 + 0.2,
						ease: "power2.out",
						scrollTrigger: {
							trigger: cardRef.current,
							start: "top 85%",
						},
						onUpdate() {
							if (valueRef.current) {
								valueRef.current.textContent = Math.round(
									this.targets()[0].n,
								).toString();
							}
						},
					},
				);
			}
		});
		return () => ctx.revert();
	}, [value, index]);

	return (
		<div ref={cardRef} className="text-center">
			<div className="mb-2 flex items-baseline justify-center gap-1">
				<span
					ref={valueRef}
					className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text font-black text-6xl text-transparent md:text-7xl"
				>
					{value}
				</span>
				<span className="font-bold text-3xl text-amber-400/70 md:text-4xl">
					{suffix}
				</span>
			</div>
			<p className="mb-1 font-semibold text-lg text-white capitalize">
				{label}
			</p>
			<p className="text-sm text-zinc-500">{description}</p>
		</div>
	);
}

export function Stats() {
	const sectionRef = useRef<HTMLElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger);
		const ctx = gsap.context(() => {
			gsap.from(titleRef.current, {
				opacity: 0,
				y: 40,
				duration: 1,
				ease: "power3.out",
				scrollTrigger: {
					trigger: titleRef.current,
					start: "top 85%",
				},
			});
		}, sectionRef);
		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={sectionRef}
			className="relative overflow-hidden bg-zinc-900 py-28"
		>
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(251,191,36,0.06)_0%,_transparent_70%)]" />
			<div
				className="absolute inset-0 opacity-20"
				style={{
					backgroundImage:
						"linear-gradient(to right, rgba(251,191,36,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(251,191,36,0.08) 1px, transparent 1px)",
					backgroundSize: "48px 48px",
				}}
			/>

			<div className="relative mx-auto max-w-5xl px-6">
				<div ref={titleRef} className="mb-16 text-center">
					<h2 className="font-bold text-3xl text-white md:text-4xl">
						Built for people who take{" "}
						<span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
							money seriously
						</span>
					</h2>
				</div>

				<div className="grid gap-12 md:grid-cols-3">
					{STATS.map((stat, i) => (
						<StatCard key={stat.label} {...stat} index={i} />
					))}
				</div>
			</div>
		</section>
	);
}
