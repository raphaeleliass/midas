import { Geist_Mono, Instrument_Sans } from "next/font/google";
import { Clarity } from "@/components/landing/clarity";
import { Closing } from "@/components/landing/closing";
import { ExperienceDemo } from "@/components/landing/experience-demo";
import { Hero } from "@/components/landing/hero";
import { LandingNav } from "@/components/landing/nav";

const instrumentSans = Instrument_Sans({
	subsets: ["latin"],
	variable: "--font-landing",
	display: "swap",
});

const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-landing-data",
	display: "swap",
});

export default function Home() {
	return (
		<div
			className={`${instrumentSans.variable} ${geistMono.variable} landing-shell dark bg-background text-foreground`}
		>
			<LandingNav />
			<main>
				<Hero />
				<ExperienceDemo />
				<Clarity />
				<Closing />
			</main>
		</div>
	);
}
