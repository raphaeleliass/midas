"use client";

import { Badge } from "@midas/ui/components/badge";
import {
	ChartNoAxesCombined,
	ChartSpline,
	type LucideIcon,
	ReceiptText,
} from "lucide-react";
import {
	AnimatePresence,
	motion,
	useMotionValueEvent,
	useReducedMotion,
	useScroll,
	useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { ProductStage, type ProductView } from "./product-stage";

type Chapter = {
	eyebrow: string;
	title: string;
	description: string;
	mode: ProductView;
	icon: LucideIcon;
	premium?: boolean;
};

const CHAPTERS: Chapter[] = [
	{
		eyebrow: "Transações",
		title: "Tudo registrado.",
		description:
			"Receitas e despesas ficam em um histórico simples de consultar, com filtros, datas e categorias.",
		mode: "transactions",
		icon: ReceiptText,
	},
	{
		eyebrow: "Visão geral",
		title: "O mês resumido.",
		description:
			"Saldo, totais e ritmo do mês aparecem juntos para você saber exatamente onde está.",
		mode: "dashboard",
		icon: ChartNoAxesCombined,
	},
	{
		eyebrow: "Analytics",
		title: "Padrões visíveis.",
		description:
			"Compare períodos, acompanhe a evolução do saldo e veja quais categorias concentram seus gastos.",
		mode: "analytics",
		icon: ChartSpline,
		premium: true,
	},
];

function ChapterCopy({ chapter }: { chapter: Chapter }) {
	const Icon = chapter.icon;
	return (
		<div className="max-w-xl">
			<div className="flex items-center gap-3 text-muted-foreground">
				<Icon className="size-4" strokeWidth={1.5} />
				<p className="landing-data text-xs uppercase tracking-[0.16em]">
					{chapter.eyebrow}
				</p>
				{chapter.premium ? <Badge variant="outline">Premium</Badge> : null}
			</div>
			<h3 className="mt-6 text-balance font-medium text-4xl leading-[0.98] tracking-[-0.05em] sm:text-6xl">
				{chapter.title}
			</h3>
			<p className="mt-6 max-w-lg text-balance text-muted-foreground leading-relaxed sm:text-lg">
				{chapter.description}
			</p>
		</div>
	);
}

function StaticChapters() {
	return (
		<div className="flex flex-col gap-24">
			{CHAPTERS.map((chapter) => (
				<article key={chapter.mode} className="flex flex-col gap-10">
					<ChapterCopy chapter={chapter} />
					<ProductStage mode={chapter.mode} />
				</article>
			))}
		</div>
	);
}

export function Clarity() {
	const sectionRef = useRef<HTMLElement>(null);
	const [activeIndex, setActiveIndex] = useState(0);
	const reduceMotion = useReducedMotion();
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end end"],
	});
	const stageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.96]);
	const stageY = useTransform(scrollYProgress, [0, 1], [30, -20]);

	useMotionValueEvent(scrollYProgress, "change", (progress) => {
		const nextIndex = progress < 0.34 ? 0 : progress < 0.67 ? 1 : 2;
		setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
	});

	return (
		<section
			ref={sectionRef}
			id="features"
			className="landing-section relative py-28 sm:py-36 lg:min-h-[290vh] lg:py-0 motion-reduce:lg:min-h-0 motion-reduce:lg:py-36"
		>
			<div className="mx-auto max-w-7xl px-5 sm:px-8 lg:hidden lg:px-10 motion-reduce:lg:block">
				<div className="mb-20 max-w-3xl">
					<p className="landing-data text-muted-foreground text-xs uppercase tracking-[0.18em]">
						Do lançamento ao entendimento
					</p>
					<h2 className="mt-6 text-balance font-medium text-4xl leading-[0.98] tracking-[-0.055em] sm:text-6xl">
						Clareza que cresce com o seu histórico.
					</h2>
				</div>
				<StaticChapters />
			</div>

			<div className="sticky top-0 hidden h-svh items-center motion-reduce:hidden lg:flex">
				<div className="mx-auto grid w-full max-w-7xl grid-cols-[0.72fr_1.28fr] items-center gap-16 px-10">
					<div>
						<p className="landing-data mb-16 text-muted-foreground text-xs uppercase tracking-[0.18em]">
							Do lançamento ao entendimento
						</p>
						<AnimatePresence mode="wait">
							<motion.div
								key={CHAPTERS[activeIndex]?.mode}
								initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: reduceMotion ? 0 : -16 }}
								transition={{
									duration: reduceMotion ? 0 : 0.32,
									ease: "easeOut",
								}}
							>
								<ChapterCopy chapter={CHAPTERS[activeIndex] ?? CHAPTERS[0]} />
							</motion.div>
						</AnimatePresence>

						<div className="mt-14 flex gap-2" aria-hidden="true">
							{CHAPTERS.map((chapter, index) => (
								<div
									key={chapter.mode}
									className={
										index === activeIndex
											? "h-px w-12 bg-foreground"
											: "h-px w-12 bg-border"
									}
								/>
							))}
						</div>
					</div>

					<motion.div style={{ scale: stageScale, y: stageY }}>
						<AnimatePresence mode="wait">
							<motion.div
								key={CHAPTERS[activeIndex]?.mode}
								initial={{ opacity: 0, scale: 0.97 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 1.015 }}
								transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
							>
								<ProductStage
									mode={CHAPTERS[activeIndex]?.mode ?? "transactions"}
								/>
							</motion.div>
						</AnimatePresence>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
