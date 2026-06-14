"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

const ITEMS = [
	"Income Tracking",
	"Expense Logging",
	"Smart Categories",
	"Color Labels",
	"Financial Clarity",
	"Zero Setup",
	"Custom Icons",
	"Unlimited Entries",
	"Private by Design",
	"Real-time Balance",
	"Clean Interface",
	"Built for Speed",
];

function MarqueeTrack({ direction = 1 }: { direction?: 1 | -1 }) {
	const trackRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = trackRef.current;
		if (!el) return;
		const totalWidth = el.scrollWidth / 2;
		const ctx = gsap.context(() => {
			gsap.fromTo(
				el,
				{ x: direction === 1 ? 0 : -totalWidth },
				{
					x: direction === 1 ? -totalWidth : 0,
					duration: 28,
					ease: "none",
					repeat: -1,
				},
			);
		});
		return () => ctx.revert();
	}, [direction]);

	const doubled = [...ITEMS, ...ITEMS];

	return (
		<div ref={trackRef} className="flex shrink-0 gap-6 whitespace-nowrap">
			{doubled.map((item, i) => (
				<span
					key={`${item}-${i}`}
					className="flex items-center gap-2 rounded-full border border-white/8 bg-white/3 px-4 py-2 text-sm text-zinc-400"
				>
					<span className="h-1 w-1 rounded-full bg-amber-400/60" />
					{item}
				</span>
			))}
		</div>
	);
}

export function Marquee() {
	return (
		<div className="overflow-hidden bg-zinc-950 py-6">
			<div className="relative">
				<div className="absolute top-0 bottom-0 left-0 z-10 w-24 bg-gradient-to-r from-zinc-950 to-transparent" />
				<div className="absolute top-0 right-0 bottom-0 z-10 w-24 bg-gradient-to-l from-zinc-950 to-transparent" />
				<div className="flex">
					<MarqueeTrack direction={1} />
				</div>
			</div>
		</div>
	);
}
