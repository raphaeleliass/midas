"use client";

import {
	createContext,
	type ReactNode,
	use,
	useEffect,
	useMemo,
	useState,
} from "react";

type Theme = "light" | "dark" | "system";

const ThemeContext = createContext<{
	theme: Theme;
	setTheme: (theme: Theme) => void;
} | null>(null);

function isTheme(value: string | null): value is Theme {
	return value === "light" || value === "dark" || value === "system";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<Theme>("system");

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		if (isTheme(savedTheme)) setTheme(savedTheme);
	}, []);

	useEffect(() => {
		const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
		const applyTheme = () => {
			const resolvedTheme =
				theme === "system" ? (systemTheme.matches ? "dark" : "light") : theme;
			document.documentElement.classList.toggle(
				"dark",
				resolvedTheme === "dark",
			);
			document.documentElement.style.colorScheme = resolvedTheme;
		};

		applyTheme();
		if (theme !== "system") return;
		systemTheme.addEventListener("change", applyTheme);
		return () => systemTheme.removeEventListener("change", applyTheme);
	}, [theme]);

	const value = useMemo(
		() => ({
			theme,
			setTheme: (nextTheme: Theme) => {
				localStorage.setItem("theme", nextTheme);
				setTheme(nextTheme);
			},
		}),
		[theme],
	);

	return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme() {
	const theme = use(ThemeContext);
	if (!theme)
		throw new Error("useTheme deve ser usado dentro de ThemeProvider");
	return theme;
}
