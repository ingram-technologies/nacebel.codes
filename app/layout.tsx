import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Manrope, Newsreader } from "next/font/google";
import type React from "react";

const manrope = Manrope({
	subsets: ["latin"],
	variable: "--font-sans",
});

const newsreader = Newsreader({
	subsets: ["latin"],
	variable: "--font-display",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${manrope.variable} ${newsreader.variable} min-h-screen bg-background text-foreground antialiased`}
			>
				{children}
				<Toaster />
			</body>
		</html>
	);
}

export const metadata = {
	title: {
		default: "NACE-BEL 2025 Codes",
		template: "%s | NACE-BEL 2025 Codes",
	},
	description:
		"Browse the full NACE-BEL 2025 classification, search codes in four languages, and use the public API.",
	metadataBase: new URL("https://nacebel.codes"),
	openGraph: {
		title: "NACE-BEL 2025 Codes",
		description:
			"Browse the full NACE-BEL 2025 classification, search codes in four languages, and use the public API.",
		type: "website",
	},
};
