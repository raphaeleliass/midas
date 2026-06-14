"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";

export function CTA() {
	const sectionRef = useRef<HTMLElement>(null);
	const orb1 = useRef<HTMLDivElement>(null);
	const orb2 = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger);
		const ctx = gsap.context(() => {
			gsap.from(contentRef.current, {
				opacity: 0,
				y: 50,
				duration: 1,
				ease: "power3.out",
				scrollTrigger: { trigger: contentRef.current, start: "top 80%" },
			});

			gsap.to(orb1.current, {
				x: 30,
				y: -20,
				duration: 6,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
			});
			gsap.to(orb2.current, {
				x: -25,
				y: 25,
				duration: 8,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
				delay: 2,
			});
		}, sectionRef);
		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={sectionRef}
			className="relative overflow-hidden bg-zinc-950 py-32"
		>
			<div
				ref={orb1}
				className="absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[100px]"
			/>
			<div
				ref={orb2}
				className="absolute right-1/4 bottom-0 h-[350px] w-[350px] rounded-full bg-yellow-400/8 blur-[90px]"
			/>

			<div
				ref={contentRef}
				className="relative mx-auto max-w-2xl px-6 text-center"
			>
				<p className="mb-4 font-semibold text-amber-400 text-xs uppercase tracking-widest">
					Get started today
				</p>
				<h2 className="mb-6 font-bold text-4xl text-white md:text-5xl">
					Ready to master{" "}
					<span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
						your finances?
					</span>
				</h2>
				<p className="mb-10 text-lg text-zinc-400">
					Join Midas and turn your financial chaos into clarity. Every
					transaction tracked, every dollar understood.
				</p>

				<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
					<motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}>
						<Link
							href="/login"
							className="block rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-10 py-4 font-semibold text-black text-lg shadow-2xl shadow-amber-400/25 transition-opacity hover:opacity-90"
						>
							Start for Free →
						</Link>
					</motion.div>
				</div>

				<p className="mt-6 text-sm text-zinc-600">
					No credit card required · No hidden fees · Private by design
				</p>
			</div>
		</section>
	);
}
