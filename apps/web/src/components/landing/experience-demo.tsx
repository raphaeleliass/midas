"use client";

import { useInView, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { ProductStage } from "./product-stage";

const RemotionDemoPlayer = dynamic(
	() => import("./demo-player").then((module) => module.DemoPlayer),
	{ ssr: false },
);

const STEPS = [
	{ label: "Adicione", detail: "Receita ou despesa" },
	{ label: "Organize", detail: "Data e categoria" },
	{ label: "Acompanhe", detail: "Saldo e histórico" },
];

export function ExperienceDemo() {
	const sectionRef = useRef<HTMLElement>(null);
	const demoRef = useRef<HTMLDivElement>(null);
	const shouldLoad = useInView(sectionRef, {
		margin: "280px 0px",
		once: true,
	});
	const active = useInView(demoRef, { amount: 0.6 });
	const reducedMotion = useReducedMotion() ?? false;

	return (
		<section
			ref={sectionRef}
			id="demo"
			className="landing-section border-y py-28 sm:py-36 lg:py-44"
		>
			<div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
				<div className="mx-auto max-w-3xl text-center">
					<p className="landing-data text-muted-foreground text-xs uppercase tracking-[0.18em]">
						Do registro à visão completa
					</p>
					<h2 className="mt-6 text-balance font-medium text-4xl leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
						Registrar leva segundos.
					</h2>
					<p className="mx-auto mt-6 max-w-xl text-balance text-muted-foreground leading-relaxed sm:text-lg">
						Adicione o que entrou ou saiu. O saldo e o histórico se atualizam na
						hora.
					</p>
				</div>

				<div
					ref={demoRef}
					className="mx-auto mt-16 min-h-[calc((100vw-2.5rem)*0.5625+3.5rem)] max-w-6xl sm:mt-20 sm:min-h-0"
				>
					{shouldLoad ? (
						<RemotionDemoPlayer active={active} reducedMotion={reducedMotion} />
					) : (
						<div
							className="flex flex-col gap-4"
							role="status"
							aria-label="Carregando demonstração do produto"
						>
							<div className="aspect-video overflow-hidden rounded-[1.5rem]">
								<ProductStage mode="transactions" className="h-full" />
							</div>
							<p className="landing-data px-1 text-[10px] text-muted-foreground uppercase tracking-[0.14em] sm:text-xs">
								Demonstração · 18 segundos · sem áudio
							</p>
						</div>
					)}
				</div>

				<ol className="mx-auto mt-14 grid max-w-4xl gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-3">
					{STEPS.map((step, index) => (
						<li
							key={step.label}
							className="flex items-center gap-4 bg-background px-5 py-5 sm:px-6"
						>
							<span className="landing-data text-muted-foreground text-xs">
								0{index + 1}
							</span>
							<div>
								<p className="font-medium text-sm">{step.label}</p>
								<p className="mt-1 text-muted-foreground text-xs">
									{step.detail}
								</p>
							</div>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
