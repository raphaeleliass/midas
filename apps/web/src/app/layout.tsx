import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";

const inter = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Midas — Personal Finance Tracker",
	description:
		"Track income and expenses with precision. Organize every dollar into smart categories and gain complete clarity over your financial life.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.variable} antialiased`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
