import type { Variants } from "motion/react";

export const fadeUp: Variants = {
	hidden: { opacity: 0, y: 16 },
	show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
};

export const stagger: Variants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.08 } },
};

export const filterVariants: Variants = {
	initial: (shouldAnimate: boolean) =>
		shouldAnimate ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 },
	animate: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
	},
	exit: (shouldAnimate: boolean) =>
		shouldAnimate
			? {
					opacity: 0,
					y: -6,
					transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
				}
			: { opacity: 1, y: 0, transition: { duration: 0 } },
};
