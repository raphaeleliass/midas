import { CTA } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Marquee } from "@/components/landing/marquee";
import { LandingNav } from "@/components/landing/nav";
import { Stats } from "@/components/landing/stats";
import { Steps } from "@/components/landing/steps";

export default function Home() {
	return (
		<div className="bg-zinc-950">
			<LandingNav />
			<Hero />
			<Marquee />
			<Features />
			<Stats />
			<Steps />
			<CTA />
			<Footer />
		</div>
	);
}
