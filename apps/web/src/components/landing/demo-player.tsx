"use client";

import { Button } from "@midas/ui/components/button";
import type { PlayerRef } from "@remotion/player";
import { Player } from "@remotion/player";
import { Pause, Play, RotateCcw } from "lucide-react";
import {
	type SyntheticEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { MidasDemoComposition, type MidasDemoProps } from "./demo-composition";

const DEMO_PROPS: MidasDemoProps = {
	initialBalanceCents: 314_360,
	transactions: [
		{
			id: "salary",
			type: "income",
			title: "Salário",
			amountCents: 485_000,
			category: "Trabalho",
		},
		{
			id: "rent",
			type: "expense",
			title: "Aluguel",
			amountCents: 142_000,
			category: "Moradia",
		},
	],
};

type DemoPlayerProps = {
	active: boolean;
	reducedMotion: boolean;
};

export function DemoPlayer({ active, reducedMotion }: DemoPlayerProps) {
	const playerRef = useRef<PlayerRef>(null);
	const startedRef = useRef(false);
	const [playing, setPlaying] = useState(false);
	const [ended, setEnded] = useState(false);

	useEffect(() => {
		const player = playerRef.current;
		if (!player) return;

		const onPlay = () => {
			startedRef.current = true;
			setPlaying(true);
		};
		const onPause = () => setPlaying(false);
		const onEnded = () => {
			setPlaying(false);
			setEnded(true);
		};

		player.addEventListener("play", onPlay);
		player.addEventListener("pause", onPause);
		player.addEventListener("ended", onEnded);

		return () => {
			player.removeEventListener("play", onPlay);
			player.removeEventListener("pause", onPause);
			player.removeEventListener("ended", onEnded);
		};
	}, []);

	useEffect(() => {
		const player = playerRef.current;
		if (!player) return;
		if (!active) {
			if (player.isPlaying()) player.pause();
			return;
		}

		if (!reducedMotion && !startedRef.current && !ended) {
			startedRef.current = true;
			player.play();
		}
	}, [active, ended, reducedMotion]);

	const replay = useCallback((event: SyntheticEvent) => {
		const player = playerRef.current;
		if (!player) return;
		startedRef.current = true;
		player.seekTo(0);
		player.play(event);
		setEnded(false);
	}, []);

	const toggle = useCallback((event: SyntheticEvent) => {
		playerRef.current?.toggle(event);
	}, []);

	return (
		<div className="flex flex-col gap-4">
			<div className="overflow-hidden rounded-[1.5rem] border bg-card shadow-2xl shadow-background">
				<Player
					ref={playerRef}
					component={MidasDemoComposition}
					inputProps={DEMO_PROPS}
					durationInFrames={540}
					compositionWidth={1600}
					compositionHeight={900}
					fps={30}
					autoPlay={false}
					initiallyMuted
					controls={false}
					clickToPlay={false}
					spaceKeyToPlayOrPause
					moveToBeginningWhenEnded={false}
					acknowledgeRemotionLicense
					style={{ width: "100%", aspectRatio: "16 / 9" }}
				/>
			</div>

			<div className="flex items-center justify-between gap-4 px-1">
				<p className="landing-data text-[10px] text-muted-foreground uppercase tracking-[0.14em] sm:text-xs">
					Demonstração · 18 segundos · sem áudio
				</p>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={ended ? replay : toggle}
						aria-label={
							ended
								? "Reproduzir novamente"
								: playing
									? "Pausar demonstração"
									: "Reproduzir demonstração"
						}
					>
						{ended ? (
							<RotateCcw data-icon="inline-start" />
						) : playing ? (
							<Pause data-icon="inline-start" />
						) : (
							<Play data-icon="inline-start" />
						)}
						<span className="hidden sm:inline">
							{ended ? "Repetir" : playing ? "Pausar" : "Reproduzir"}
						</span>
					</Button>
				</div>
			</div>
		</div>
	);
}
