"use client";

import { Button, buttonVariants } from "@midas/ui/components/button";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ProductStage } from "./product-stage";

export function Hero() {
	const reduceMotion = useReducedMotion();
	const duration = reduceMotion ? 0 : 0.82;

	return (
		<section
			id="product"
			className="landing-section relative flex min-h-[112svh] flex-col overflow-hidden pt-32 sm:pt-36"
		>
			<div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center px-5 text-center sm:px-8 lg:px-10">
				<motion.p
					initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
					className="landing-data text-muted-foreground text-xs uppercase tracking-[0.18em]"
				>
					Controle financeiro pessoal
				</motion.p>

				<motion.h1
					initial={{ opacity: 0, y: reduceMotion ? 0 : 26 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration,
						delay: reduceMotion ? 0 : 0.08,
						ease: [0.22, 1, 0.36, 1],
					}}
					className="mt-7 max-w-5xl text-balance font-medium text-5xl leading-[0.94] tracking-[-0.065em] sm:text-7xl lg:text-[6.7rem]"
				>
					Seu mês, em uma única visão.
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration,
						delay: reduceMotion ? 0 : 0.18,
						ease: [0.22, 1, 0.36, 1],
					}}
					className="mt-7 max-w-2xl text-balance text-base text-muted-foreground leading-relaxed sm:text-lg"
				>
					Registre receitas e despesas. O Midas organiza o restante para você
					acompanhar saldo, categorias e evolução.
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration,
						delay: reduceMotion ? 0 : 0.28,
						ease: [0.22, 1, 0.36, 1],
					}}
					className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
				>
					<Button
						size="lg"
						nativeButton={false}
						render={<Link href="/login" />}
					>
						Criar conta grátis
						<ArrowUpRight data-icon="inline-end" />
					</Button>
					<Link
						href="#demo"
						className={buttonVariants({ variant: "ghost", size: "lg" })}
					>
						Ver demonstração
						<ArrowDown data-icon="inline-end" />
					</Link>
				</motion.div>

				<motion.div
					initial={{
						opacity: 0,
						y: reduceMotion ? 0 : 90,
						scale: reduceMotion ? 1 : 0.92,
					}}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{
						duration: reduceMotion ? 0 : 1.05,
						delay: reduceMotion ? 0 : 0.35,
						ease: [0.22, 1, 0.36, 1],
					}}
					className="mt-20 w-full max-w-5xl origin-bottom sm:mt-24"
				>
					<ProductStage mode="dashboard" />
				</motion.div>
			</div>
		</section>
	);
}
