import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata, Viewport } from "next";
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

const siteName = "NACE-BEL 2025 Codes";
const siteDescription =
	"Search the full NACE-BEL 2025 classification of Belgian economic activities in Dutch, French, English, and German. Free public API included.";

export const metadata: Metadata = {
	metadataBase: new URL("https://nacebel.codes"),
	title: {
		default: siteName,
		template: "%s | NACE-BEL 2025 Codes",
	},
	description: siteDescription,
	applicationName: siteName,
	keywords: [
		"NACE-BEL",
		"NACE-BEL 2025",
		"NACEBEL",
		"NACE codes",
		"Belgian economic activity codes",
		"NACE Rev. 2.1",
		"KBO NACE",
		"Belgium business classification",
		"economic activity codes",
	],
	category: "reference",
	authors: [{ name: "Ingram Technologies", url: "https://ingram.tech" }],
	creator: "Ingram Technologies",
	publisher: "Ingram Technologies",
	formatDetection: {
		email: false,
		telephone: false,
		address: false,
	},
	alternates: {
		canonical: "/",
	},
	openGraph: {
		title: siteName,
		description: siteDescription,
		url: "https://nacebel.codes",
		siteName,
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: siteName,
		description: siteDescription,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-snippet": -1,
			"max-image-preview": "large",
		},
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#0b1120" },
	],
	colorScheme: "light dark",
};
